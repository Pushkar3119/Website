import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { getCounselorPageInfo } from '@/api/counselor';
import type { CounselorPageInfo } from '@/types/counselor';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InfoModal() {
  const { isCounselorSignupOpen, toggleCounselorSignup, isAuthenticated, toggleLogin } = useAuthStore();
  const navigate = useNavigate();

  const [info, setInfo] = useState<CounselorPageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isCounselorSignupOpen) {
      const fetchInfo = async () => {
        setLoading(true);
        try {
          const data = await getCounselorPageInfo();
          setInfo(data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
          toast.error(errorMessage);
          toggleCounselorSignup(); 
        } finally {
          setLoading(false);
        }
      };
      fetchInfo();
    }
  }, [isCounselorSignupOpen, toggleCounselorSignup]);

  const handleProceed = () => {
    if (!isAuthenticated) {
      toggleCounselorSignup();
      toggleLogin();
      toast.error("Please log in to become a counsellor.");
    } else {
      toggleCounselorSignup();
      navigate('/counselor-signup');
    }
  };

  if (!isCounselorSignupOpen) {
    return null;
  }
  
  const renderSection = (title: string, points: string[]) => (
    <div key={title} className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <ul className="list-disc list-inside space-y-2">
        {points.map((point, index) => (
          <li key={index} className="text-base font-medium text-gray-500">{point}</li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col relative">
        <button 
            onClick={toggleCounselorSignup} 
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
        >
            <X className="h-6 w-6" />
        </button>
        
        <div className="flex-1 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FA660F]" />
                </div>
            ) : info ? (
                <div className="py-10 px-6 md:px-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-medium text-[#13097D]">
                            Become a Counsellor on ProCounsel
                        </h2>
                        {info["Become a Counsellor on ProCounsel"] && (
                            <p className="mt-4 text-base font-medium text-gray-800 max-w-3xl mx-auto">
                                {info["Become a Counsellor on ProCounsel"].join(' ')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {renderSection("Why Join?", info["Why Join?"])}
                        {renderSection("What Happens When You Switch", info["What Happens When You Switch"])}
                        {renderSection("Steps to Get Started", info["Steps to Get Started"])}
                    </div>
                </div>
            ) : (
                 <div className="text-center text-gray-500 py-10">No information available.</div>
            )}
        </div>

        <div className="px-6 py-4 border-t bg-white sticky bottom-0">
            <div className="flex justify-center items-center mb-4">
                <input
                    id="agree-checkbox"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-5 w-5 text-[#FA660F] focus:ring-[#FA660F] border-[#13097D] rounded"
                />
                <label htmlFor="agree-checkbox" className="ml-3 text-sm font-medium text-[#6C6969]">
                    By continuing, you agree to Procounsel's <a href="/terms" target="_blank" className="underline text-[#2F2F2F] hover:text-[#FA660F]">Terms & Condition</a> and <a href="/privacy-policy" target="_blank" className="underline text-[#2F2F2F] hover:text-[#FA660F]">Privacy Policy</a>.
                </label>
            </div>
            <div className="text-center">
                <button
                    onClick={handleProceed}
                    disabled={!agreed || loading}
                    className={`w-[444px] max-w-full h-11 rounded-xl font-semibold text-white text-base transition-colors ${
                        agreed ? 'bg-[#FA660F] hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    Proceed
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}