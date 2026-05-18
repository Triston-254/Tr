import React, { useEffect, useState, useRef } from 'react';
import Toast from './components/Toast';
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

import PublicFeedbackForm from './pages/PublicFeedbackForm';
import AdminLogin from './pages/AdminLogin';
import AdminSubmissions from './pages/AdminSubmissions';
import PasswordResetRequest from './pages/PasswordResetRequest';
import SetNewPassword from './pages/SetNewPassword';

export default function App() {
  const [adminSession, setAdminSession] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [toast, setToast] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isInitialCheck = useRef(true);

   const fetchSubmissions = async () => {
     if (!adminSession) return;
     try {
       const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
       const querySnapshot = await getDocs(q);
       const fetchedSubmissions = [];
       querySnapshot.forEach((doc) => {
         fetchedSubmissions.push({ id: doc.id, ...doc.data() });
       });
       setSubmissions(fetchedSubmissions);
     } catch (e) {
       console.error("Error fetching submissions: ", e);
     }
   };

  const updateStatus = async (id, status) => {
    if (!adminSession) return;
    try {
      const submissionRef = doc(db, 'submissions', id);
      await updateDoc(submissionRef, { status: status });
      await fetchSubmissions();
    } catch (e) {
      console.error("Error updating submission: ", e);
    }
  };

  const onPublicSubmitted = async () => {
    
    await fetchSubmissions();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminSession({ uid: user.uid, email: user.email });
      } else if (!authLoading) {
        // Only clear session if this is not the initial check
        setAdminSession(null);
        setSubmissions([]);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch submissions whenever adminSession changes
  useEffect(() => {
    if (adminSession) {
      fetchSubmissions();
    }
  }, [adminSession]);

  const Header = () => (
    <div className="topNav">
      <div className="topNavInner">
        <div className="brand">
          Feedback<span className="brandDot">.</span>
          <span className="brandLight">Management</span>
        </div>

        <div className="navLinks">
          <Link to="/" className="navLink">
            Public Form
          </Link>
          <Link to="/admin" className="navLink">
            Admin
          </Link>

           {adminSession ? (
              <button
                type="button"
                className="btn btnGhost"
                onClick={() => {
                  signOut(auth).then(() => {
                    setAdminSession(null);
                    setToast({ type: 'success', message: 'Logged out successfully' });
                  }).catch((err) => {
                    console.error("Error signing out: ", err);
                    setToast({ type: 'error', message: 'Logout failed' });
                  });
                }}
              >
                Logout
              </button>
            ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Header />
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
      <Routes>
        <Route path="/" element={<PublicFeedbackForm onSubmitted={onPublicSubmitted} />} />

        <Route
          path="/admin"
          element={
            authLoading ? (
              <AdminLogin
                onLogin={(session) => setAdminSession(session)}
                onToast={(t) => setToast(t)}
              />
            ) : adminSession ? (
              <Navigate to="/admin/submissions" replace />
            ) : (
              <AdminLogin
                onLogin={(session) => setAdminSession(session)}
                onToast={(t) => setToast(t)}
              />
            )
          }
        />

        <Route
          path="/admin/submissions"
          element={
            authLoading ? (
              <AdminSubmissions
                submissions={submissions}
                onUpdateStatus={updateStatus}
                onRefresh={fetchSubmissions}
                onToast={(t) => setToast(t)}
              />
            ) : adminSession ? (
              <AdminSubmissions
                submissions={submissions}
                onUpdateStatus={updateStatus}
                onRefresh={fetchSubmissions}
                onToast={(t) => setToast(t)}
              />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route path="/admin/reset-password" element={<PasswordResetRequest onToast={(t) => setToast(t)} />} />
        <Route path="/admin/set-new-password" element={<SetNewPassword onToast={(t) => setToast(t)} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
