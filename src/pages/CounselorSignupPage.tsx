import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import type { CounselorFormData } from '@/types/counselor';
import { sendOtp, sendEmailOtp, verifyOtp, verifyEmailOtp, counsellorSignup } from '@/api/auth';
import ProfileDetailsStep from '@/components/counselor-signup/ProfileDetailsStep';
import CourseSelectionStep from '@/components/counselor-signup/CourseSelectionStep';
import StateSelectionStep from '@/components/counselor-signup/StateSelectionStep';
import OtpVerificationModal from '@/components/counselor-signup/OtpVerificationModal';
import { ChevronLeft, Loader2 } from 'lucide-react';

const initialFormData: CounselorFormData = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  organisation: '',
  languagesKnown: [],
  workingDays: [],
  officeStartTime: '',
  officeEndTime: '',
  phoneOtpVerified: false,
  emailOtpVerified: false,
  expertise: [],
  stateOfCounsellor: [],
};

type VerificationType = 'phone' | 'email' | null;

export default function CounselorSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CounselorFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<VerificationType>(null);

  const navigate = useNavigate();
  const { toggleCounselorSignup } = useAuthStore();

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleBackToInfoModal = () => {
    navigate(-1);
    setTimeout(() => toggleCounselorSignup(), 100);
  };

  const handleCourseSelect = (courseName: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(courseName)
        ? prev.expertise.filter(c => c !== courseName)
        : [...prev.expertise, courseName]
    }));
  };

  const handleStateSelect = (stateName: string) => {
    setFormData(prev => ({
      ...prev,
      stateOfCounsellor: prev.stateOfCounsellor.includes(stateName)
        ? prev.stateOfCounsellor.filter(s => s !== stateName)
        : [...prev.stateOfCounsellor, stateName]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      organisationName: formData.organisation,
      languagesKnow: formData.languagesKnown,
      workingDays: formData.workingDays,
      officeStartTime: formData.officeStartTime,
      officeEndTime: formData.officeEndTime,
      expertise: formData.expertise,
      stateOfCounsellor: formData.stateOfCounsellor,
      phoneOtpVerified: formData.phoneOtpVerified,
      emailOtpVerified: formData.emailOtpVerified,
    };
    try {
      await counsellorSignup(payload);
      toast.success('Application submitted successfully! Our team will review your details.');
      navigate('/counselor-dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      await sendOtp(formData.phoneNumber);
      setVerificationType('phone');
      setOtpModalOpen(true);
      toast.success('OTP sent to your phone!');
    } catch (error) {
      toast.error('Failed to send OTP. Please check the number and try again.');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendEmailOtp(formData.email);
      setVerificationType('email');
      setOtpModalOpen(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error('Failed to send OTP. Please check the email and try again.');
    }
  };

  const handleOtpVerification = async (otp: string): Promise<boolean> => {
    try {
      if (verificationType === 'phone') {
        await verifyOtp(formData.phoneNumber, otp);
        setFormData(prev => ({ ...prev, phoneOtpVerified: true }));
      } else if (verificationType === 'email') {
        await verifyEmailOtp(formData.email, otp);
        setFormData(prev => ({ ...prev, emailOtpVerified: true }));
      }
      toast.success('Verification successful!');
      setOtpModalOpen(false);
      return true;
    } catch (error) {
      console.error("OTP Verification failed", error);
      return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Profile Details";
      case 2: return "Select Courses";
      case 3: return "Select States";
      default: return "";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex-1 overflow-y-auto pr-4 -mr-4">
            <ProfileDetailsStep
              formData={formData}
              setFormData={setFormData}
              onNext={handleNextStep}
              onVerifyPhone={handleVerifyPhone}
              onVerifyEmail={handleVerifyEmail}
            />
          </div>
        );
      case 2:
        return (
          <>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
              <CourseSelectionStep
                selectedCourses={formData.expertise}
                onCourseSelect={handleCourseSelect}
              />
            </div>
            <div className="pt-6 text-center flex-shrink-0">
              <button
                onClick={handleNextStep}
                disabled={(formData.expertise?.length ?? 0) === 0}
                className="w-[444px] h-11 text-white rounded-xl font-semibold text-base transition-colors disabled:bg-[#ACACAC] bg-[#FA660F] hover:bg-orange-700"
              >
                Next
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
              <StateSelectionStep
                selectedStates={formData.stateOfCounsellor}
                onStateSelect={handleStateSelect}
              />
            </div>
            <div className="pt-6 text-center flex-shrink-0">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (formData.stateOfCounsellor?.length ?? 0) === 0}
                className="w-[444px] h-11 text-white rounded-xl font-semibold text-base transition-colors disabled:bg-[#ACACAC] bg-[#FA660F] hover:bg-orange-700 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Application'}
              </button>
            </div>
          </>
        );
      default:
        return <div className="text-center p-8">Invalid Step</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-40 font-montserrat">
      <div className="w-full max-w-[932px] h-auto max-h-[90vh] bg-white rounded-2xl shadow-lg p-10 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={step === 1 ? handleBackToInfoModal : handlePrevStep} className="text-[#343C6A] hover:opacity-75">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-[#343C6A]">{getStepTitle()}</h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-[#232323]">Step {step} of 3</span>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-[70px] h-[7px] rounded-full ${step >= s ? 'bg-[#FA660F]' : 'bg-[#E9E9E9]'}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex-1 flex flex-col min-h-0">
          {renderStepContent()}
        </div>
      </div>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title={verificationType === 'phone' ? 'Phone Verification' : 'Email Verification'}
        description="Please input the OTP sent on"
        contactInfo={verificationType === 'phone' ? `+91-${formData.phoneNumber}` : formData.email}
        otpLength={verificationType === 'phone' ? 4 : 6}
        onVerify={handleOtpVerification}
        onResend={verificationType === 'phone' ? handleVerifyPhone : handleVerifyEmail}
      />
    </div>
  );
}