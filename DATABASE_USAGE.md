# Multi-Database Setup with Drizzle ORM

This project uses 3 separate MySQL databases with Drizzle ORM:

## Database Structure

### 1. **etest_users** - User Authentication
- **Tables**: `users`
- **Purpose**: User authentication, facility assignments, permissions
- **Access**: `getUsersDb()`

### 2. **etest_eid** - Early Infant Diagnosis
- **Tables**: `batches`, `dbs_samples`
- **Purpose**: EID test requests, batch management, DBS samples
- **Access**: `getEidDb()`

### 3. **etest_vl_lims** - Viral Load LIMS
- **Tables**: `vl_patients`, `vl_samples`
- **Purpose**: Viral load testing, patient management, sample tracking
- **Access**: `getVlLimsDb()`

## Usage Examples

### Basic Database Access

```typescript
import { getUsersDb, getEidDb, getVlLimsDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { batches, dbs_samples } from '@/server/db/schemas/eid';
import { vl_patients, vl_samples } from '@/server/db/schemas/vl-lims';
import { eq } from 'drizzle-orm';

// Users database
const usersDb = await getUsersDb();
const allUsers = await usersDb.select().from(users);

// EID database
const eidDb = await getEidDb();
const recentBatches = await eidDb.select().from(batches).limit(10);

// VL LIMS database
const vlDb = await getVlLimsDb();
const patients = await vlDb.select().from(vl_patients);
```

### Cross-Database Queries

```typescript
// Get user and their facility's batches
export async function getUserDashboard(userId: number) {
  // Get user from etest_users
  const usersDb = await getUsersDb();
  const user = await usersDb
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]?.facility_id) return null;

  // Get EID batches for user's facility
  const eidDb = await getEidDb();
  const eidBatches = await eidDb
    .select()
    .from(batches)
    .where(eq(batches.facility_id, user[0].facility_id));

  // Get VL patients for user's facility
  const vlDb = await getVlLimsDb();
  const vlPatients = await vlDb
    .select()
    .from(vl_patients)
    .where(eq(vl_patients.facility_id, user[0].facility_id));

  return {
    user: user[0],
    eidBatches,
    vlPatients,
  };
}
```

### Creating Records

```typescript
// Create EID batch
export async function createEidBatch(batchData: {
  facility_id: number;
  senders_name: string;
  // ... other fields
}) {
  const eidDb = await getEidDb();
  return await eidDb.insert(batches).values(batchData);
}

// Create VL patient
export async function createVlPatient(patientData: {
  unique_id: string;
  facility_id: number;
  // ... other fields
}) {
  const vlDb = await getVlLimsDb();
  return await vlDb.insert(vl_patients).values(patientData);
}
```

## API Route Examples

### EID API Route

```typescript
// app/api/eid/batches/route.ts
import { getEidDb } from '@/server/db';
import { batches } from '@/server/db/schemas/eid';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facilityId = searchParams.get('facilityId');

  const db = await getEidDb();
  const facilityBatches = await db
    .select()
    .from(batches)
    .where(eq(batches.facility_id, Number(facilityId)));

  return Response.json(facilityBatches);
}
```

### VL API Route

```typescript
// app/api/vl/patients/route.ts
import { getVlLimsDb } from '@/server/db';
import { vl_patients } from '@/server/db/schemas/vl-lims';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facilityId = searchParams.get('facilityId');

  const db = await getVlLimsDb();
  const patients = await db
    .select()
    .from(vl_patients)
    .where(eq(vl_patients.facility_id, Number(facilityId)));

  return Response.json(patients);
}
```

## Environment Configuration

Make sure your `.env.local` has the base database URL:

```bash
# Base database URL - each database function will modify this
DATABASE_URL="mysql://username:password@localhost:3306/etest_users"

# JWT Secret (reusing BETTER_AUTH_SECRET)
BETTER_AUTH_SECRET="your-super-secure-secret-key"
```

The system automatically switches databases by replacing the database name in the URL:
- `mysql://user:pass@localhost:3306/etest_users`
- `mysql://user:pass@localhost:3306/etest_eid`
- `mysql://user:pass@localhost:3306/etest_vl_lims`

## Type Safety

All schemas provide TypeScript types:

```typescript
import type { 
  UserType, 
  BatchType, 
  DbsSampleType, 
  VlPatientType, 
  VlSampleType 
} from '@/server/db/examples';

// Or infer directly from schema
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
```

## Connection Management

- Connections are cached in development to avoid creating new connections on HMR
- Each database has its own connection pool
- Connections are reused efficiently across requests
- No need to manually close connections - handled automatically

## Best Practices

1. **Use specific database functions**: Always use `getUsersDb()`, `getEidDb()`, or `getVlLimsDb()`
2. **Import correct schemas**: Import from the appropriate schema file for each database
3. **Type safety**: Use TypeScript inference for better development experience
4. **Error handling**: Wrap database calls in try-catch blocks
5. **Transactions**: Each database connection supports transactions independently

## Example: Complete Feature Implementation

```typescript
// services/eid-service.ts
import { getEidDb, getUsersDb } from '@/server/db';
import { batches, dbs_samples } from '@/server/db/schemas/eid';
import { users } from '@/server/db/schemas/users';
import { eq } from 'drizzle-orm';

export async function createEidRequest(
  userId: number,
  batchData: Omit<typeof batches.$inferInsert, 'entered_by' | 'facility_id'>,
  samples: Omit<typeof dbs_samples.$inferInsert, 'batch_id'>[]
) {
  // Get user to determine facility
  const usersDb = await getUsersDb();
  const user = await usersDb
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]?.facility_id) {
    throw new Error('User has no facility assigned');
  }

  // Create batch in EID database
  const eidDb = await getEidDb();
  
  // Use transaction for batch + samples
  return await eidDb.transaction(async (tx) => {
    // Create batch
    const [batch] = await tx
      .insert(batches)
      .values({
        ...batchData,
        entered_by: userId,
        facility_id: user[0].facility_id,
      });

    // Create samples
    const samplesWithBatchId = samples.map(sample => ({
      ...sample,
      batch_id: batch.insertId,
    }));

    await tx.insert(dbs_samples).values(samplesWithBatchId);

    return batch;
  });
}
```

This setup gives you full access to all 3 databases while maintaining type safety and connection efficiency! 