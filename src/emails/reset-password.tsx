import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  userName?: string;
  resetUrl?: string;
}

export const ResetPasswordEmail = ({
  userName = 'there',
  resetUrl = 'https://example.com/reset-password',
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password for Uganda Viral Load Manager</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Uganda Viral Load Manager</Heading>
        </Section>
        
        <Section style={content}>
          <Heading style={h2}>Reset your password</Heading>
          <Text style={text}>
            Hi {userName},
          </Text>
          <Text style={text}>
            You requested to reset your password for Uganda Viral Load Manager.
          </Text>
          <Text style={text}>
            Click the button below to reset your password:
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={resetUrl} style={button}>
              Reset Password
            </Button>
          </Section>
          
          <Text style={text}>
            This link will expire in 1 hour.
          </Text>
          <Text style={text}>
            If you didn't request this password reset, please ignore this email.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            Best regards,<br />
            Uganda Viral Load Manager Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 0',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '600',
  margin: '0',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px',
};

const content = {
  padding: '0 24px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  padding: '24px 24px 0',
  marginTop: '40px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}; 