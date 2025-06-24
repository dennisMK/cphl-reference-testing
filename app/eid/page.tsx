"use client"
import Link from 'next/link'
import React from 'react'
import { IconPlus, IconTestPipe } from '@tabler/icons-react'

export default function page() {
  return (
    <>
    {/* cards for create requests & collect sample */}
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
     <Link href="/eid/create-request" className="group">
       <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
         <div className="flex items-center space-x-4 mb-4">
           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500">
             <IconPlus className="h-7 w-7 text-white" />
           </div>
           <div>
             <h3 className="text-2xl font-semibold text-gray-900">Create Request</h3>
           </div>
         </div>
         <p className="text-gray-600 leading-relaxed">Create a new EID test request for infant HIV diagnosis</p>
       </div>
     </Link>
     
     <Link href="/eid/collect-sample" className="group">
       <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
         <div className="flex items-center space-x-4 mb-4">
           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500">
             <IconTestPipe className="h-7 w-7 text-white" />
           </div>
           <div>
             <h3 className="text-2xl font-semibold text-gray-900">Collect Sample</h3>
           </div>
         </div>
         <p className="text-gray-600 leading-relaxed">Collect and register biological samples for testing</p>
       </div>
     </Link>
   </div>
    
    </>
  )
}
