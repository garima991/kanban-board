import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setOnlineStatus } from "../redux/features/appSlice";
import { useLocation } from "react-router-dom";

const NetworkListener = () => {
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.app.isOnline);
  const location = useLocation();
  const wasOfflineBefore = useRef(false);
  const toastIdRef = useRef(null); // store active toast id manually
  
  useEffect(() => {
    const updateStatus = () => {
      const online = navigator.onLine;
      dispatch(setOnlineStatus(online));

      // Dismiss any previous toast manually
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }

      if (online) {
         if (wasOfflineBefore.current) {
          toastIdRef.current = toast.success("You're back online");
        }
        wasOfflineBefore.current = false; // reset
      } else {
        wasOfflineBefore.current = true;
        toastIdRef.current = toast.error("You're offline");
      }
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    updateStatus(); // fire once on mount

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, [dispatch]);

  // Show reminder toast on route change if still offline
  useEffect(() => {
    if (!isOnline && !hasShownOfflineToast.current) {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      toastIdRef.current = toast.error("You are still offline");
      hasShownOfflineToast.current = true;
    }
  }, [location.pathname, isOnline]);

  return null;
};

export default NetworkListener;
