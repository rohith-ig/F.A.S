"use client"
import {jwtDecode} from 'jwt-decode'
import { use, useEffect } from 'react'
import { useSearchParams,useRouter } from 'next/navigation'
const HandleAuth = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        try {
            const token = searchParams.get('token');
            console.log(token)
            if (token) {
                const decoded = jwtDecode(token);
                localStorage.setItem('token', token);
                localStorage.setItem('userId', decoded.userId);
                document.cookie = `token=${token}; path=/; max-age=1800; samesite=lax`; 
                const role = decoded.role;
                if (role === 'ADMIN') {
                    router.push('/admin/');
                } else if (role === 'STUDENT') {
                    router.push('/student');
                } else if (role === 'FACULTY') {
                    router.replace('/faculty');
                } else {
                    router.replace('/');
                    return
                }
            } else {
                router.push('/'); 
            }
        } catch (error) {
            console.error('Error handling authentication:', error);
            router.replace('/');
        }
    }, []);
  
  return (
    <div>Token not found or internet slow</div>
  )
}
export default HandleAuth