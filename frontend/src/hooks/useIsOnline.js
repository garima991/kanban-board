// import { useEffect, useRef, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { useLocation } from 'react-router';

// export const useIsOnline = () => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const location = useLocation();
//   const hasShownToast = useRef(false); // to prevent duplicate toasts

//   useEffect(() => {
//     const updateStatus = () => {
//       const online = navigator.onLine;
//       setIsOnline(online);

//       if (online) {
//         toast.success('Back online !');
//         hasShownToast.current = false;
//       } else {
//         toast.error('You are offline !');
//       }
//     };

//     window.addEventListener('online', updateStatus);
//     window.addEventListener('offline', updateStatus);

//     return () => {
//       window.removeEventListener('online', updateStatus);
//       window.removeEventListener('offline', updateStatus);
//     };
//   }, []);

//    useEffect(() => {
//     // On route change, check if already offline
//     if (!navigator.onLine && !hasShownToast.current) {
//       toast.error('You are offline!');
//       hasShownToast.current = true;
//     }
//   }, [location]);

//   return isOnline;
// };
