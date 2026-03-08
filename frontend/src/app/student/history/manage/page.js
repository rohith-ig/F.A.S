import React from 'react'
import { Suspense } from 'react'
import ManageRequests from './manageHistory'
const page = () => {
  return (
    <Suspense fallback={<div>
        Compiling...
        
    </div>}>
        <ManageRequests />
    </Suspense>
  )
}

export default page
