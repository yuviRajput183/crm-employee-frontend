import React, { useState, useEffect, useRef } from 'react';
import logo from '@/assets/images/crm-logo.jpg';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage, getSuccessMessage } from '@/lib/helpers/get-message';
import { Alert } from "@/components/ui/alert";

// ─────────────────────────────────────────────────────────────────────────────
// Schema for Normal Login
// ─────────────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
    userType: z.enum(['Advisor', 'Employee'], { required_error: 'Please select a user type' }),
    username: z.string().min(1, { message: 'User Name is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Schema for WhatsApp OTP Login — Step 1 (mobile)
// ─────────────────────────────────────────────────────────────────────────────
const mobileSchema = z.object({
    mobile: z
        .string()
        .min(1, { message: 'Mobile number is required' })
        .regex(/^[0-9]{10}$/, { message: 'Enter a valid 10-digit mobile number' }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Schema for WhatsApp OTP Login — Step 2 (OTP)
// ─────────────────────────────────────────────────────────────────────────────
const otpSchema = z.object({
    otp: z
        .string()
        .min(1, { message: 'OTP is required' })
        .regex(/^[0-9]{6}$/, { message: 'OTP must be a 6-digit number' }),
});

// ─────────────────────────────────────────────────────────────────────────────
// OTP Countdown Timer Component
// ─────────────────────────────────────────────────────────────────────────────
const CountdownTimer = ({ targetDate, label }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!targetDate) return;
        const update = () => {
            const diff = Math.max(0, Math.ceil((new Date(targetDate) - new Date()) / 1000));
            setSeconds(diff);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (seconds <= 0) return null;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    return (
        <span className="text-xs text-gray-500">
            {label} <span className="font-semibold text-blue-600">{display}</span>
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main SignIn Component
// ─────────────────────────────────────────────────────────────────────────────
const SignIn = () => {
    const { signIn, sendWhatsappOtp, verifyWhatsappOtp, resendWhatsappOtp } = useAuth();
    const navigate = useNavigate();

    // 'normal' | 'whatsapp'
    const [loginMethod, setLoginMethod] = useState('normal');

    // WhatsApp OTP flow state
    const [otpStep, setOtpStep] = useState('mobile'); // 'mobile' | 'otp'
    const [otpMobile, setOtpMobile] = useState('');
    const [otpExpiresAt, setOtpExpiresAt] = useState(null);
    const [resendAvailableAt, setResendAvailableAt] = useState(null);
    const [otpError, setOtpError] = useState('');
    const [otpSuccess, setOtpSuccess] = useState('');

    // ── Normal Login Form ──────────────────────────────────────────────────────
    const { mutateAsync, isLoading, isError, error, isSuccess, data } = signIn;

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userType: '',
            username: '',
            password: '',
        },
    });

    const handleLogin = async (formData) => {
        console.log("sign-in form data >>", formData);
        try {
            const res = await mutateAsync({
                role: formData?.userType,
                loginName: formData?.username,
                password: formData?.password,
            });

            console.log("response of login api call>>", res?.data?.data);

            if (res?.data?.success) {
                localStorage.setItem("token", res?.data?.data?.token);
                localStorage.setItem("profile", JSON.stringify(res?.data?.data?.profile));
                const redirectPath = res?.data?.data?.role === "employee" ? "/admin/dashboard" : "/advisor/dashboard";
                navigate(redirectPath);
            }
        } catch (err) {
            console.log("Error in Login Api call>>", err);
        }
    };

    // ── WhatsApp OTP Forms ─────────────────────────────────────────────────────
    const mobileForm = useForm({
        resolver: zodResolver(mobileSchema),
        defaultValues: { mobile: '' },
    });

    const otpForm = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    // Reset WhatsApp OTP state when switching login methods
    const handleMethodChange = (method) => {
        setLoginMethod(method);
        setOtpStep('mobile');
        setOtpMobile('');
        setOtpExpiresAt(null);
        setResendAvailableAt(null);
        setOtpError('');
        setOtpSuccess('');
        mobileForm.reset();
        otpForm.reset();
    };

    // Step 1: Send OTP
    const handleSendOtp = async (formData) => {
        setOtpError('');
        setOtpSuccess('');
        try {
            const res = await sendWhatsappOtp.mutateAsync({ mobile: formData.mobile });
            if (res?.data?.success) {
                setOtpMobile(formData.mobile);
                setOtpExpiresAt(res?.data?.data?.otpExpiresAt);
                setResendAvailableAt(res?.data?.data?.resendAvailableAt);
                setOtpStep('otp');
                otpForm.reset();
            }
        } catch (err) {
            setOtpError(getErrorMessage(err));
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (formData) => {
        setOtpError('');
        setOtpSuccess('');
        try {
            const res = await verifyWhatsappOtp.mutateAsync({
                mobile: otpMobile,
                otp: formData.otp,
            });

            if (res?.data?.success) {
                // Identical token storage pattern as normal login
                localStorage.setItem("token", res?.data?.data?.token);
                localStorage.setItem("profile", JSON.stringify(res?.data?.data?.profile));
                const redirectPath = res?.data?.data?.role === "employee" ? "/admin/dashboard" : "/advisor/dashboard";
                navigate(redirectPath);
            }
        } catch (err) {
            setOtpError(getErrorMessage(err));
        }
    };

    // Resend OTP
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!resendAvailableAt) {
            setCanResend(true);
            return;
        }
        const check = () => {
            setCanResend(new Date() >= new Date(resendAvailableAt));
        };
        check();
        const interval = setInterval(check, 1000);
        return () => clearInterval(interval);
    }, [resendAvailableAt]);

    const handleResendOtp = async () => {
        setOtpError('');
        setOtpSuccess('');
        try {
            const res = await resendWhatsappOtp.mutateAsync({ mobile: otpMobile });
            if (res?.data?.success) {
                setOtpExpiresAt(res?.data?.data?.otpExpiresAt);
                setResendAvailableAt(res?.data?.data?.resendAvailableAt);
                setOtpSuccess('A new OTP has been sent to your WhatsApp number.');
                otpForm.reset();
            }
        } catch (err) {
            setOtpError(getErrorMessage(err));
        }
    };

    return (
        <div className='w-[100vw] h-[100vh] md:flex items-center justify-center overflow-y-auto'>

            <div className='w-[90%] md:w-[90%] lg:w-[60%] flex flex-col md:flex-row rounded-xl shadow-lg mx-auto mt-8 md:mt-0'>

                {/* Logo container */}
                <div className='md:flex-4 flex items-center justify-center'>
                    <img src={logo} className='' />
                </div>

                {/* Form container */}
                <div className="md:flex-6 p-4 mx-auto w-full">
                    <h1 className="text-2xl font-bold text-center mb-1">Welcome to Loan Sahayak CRM!</h1>
                    <p className="text-center mb-4 text-sm text-gray-600">Please sign in to continue</p>

                    {/* ── Login Method Toggle ─────────────────────────────────── */}
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-5">
                        <button
                            id="btn-normal-login"
                            type="button"
                            onClick={() => handleMethodChange('normal')}
                            className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200 ${
                                loginMethod === 'normal'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Normal Login
                        </button>
                        <button
                            id="btn-whatsapp-login"
                            type="button"
                            onClick={() => handleMethodChange('whatsapp')}
                            className={`flex-1 py-2 text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                                loginMethod === 'whatsapp'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp OTP
                        </button>
                    </div>

                    {/* ── Normal Login Form ───────────────────────────────────── */}
                    {loginMethod === 'normal' && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 font-semibold">
                                {isError && (
                                    <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                                )}
                                {isSuccess && (
                                    <Alert variant="success">{getSuccessMessage(data)}</Alert>
                                )}
                                <FormField
                                    control={form.control}
                                    name="userType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Type</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Advisor">Advisor</SelectItem>
                                                        <SelectItem value="Employee">Employee</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter User Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button loading={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                    Submit
                                </Button>

                                <p className="text-center text-sm mt-2">
                                    Don't have an advisor account?{' '}
                                    <span className="text-blue-600 font-medium hover:underline">Create an Account</span>
                                </p>
                            </form>
                        </Form>
                    )}

                    {/* ── WhatsApp OTP Login ──────────────────────────────────── */}
                    {loginMethod === 'whatsapp' && (
                        <div className="space-y-4">

                            {/* Global error/success alerts */}
                            {otpError && (
                                <Alert variant="destructive">{otpError}</Alert>
                            )}
                            {otpSuccess && (
                                <Alert variant="success">{otpSuccess}</Alert>
                            )}

                            {/* ── Step 1: Mobile Number Entry ──────────────────── */}
                            {otpStep === 'mobile' && (
                                <Form {...mobileForm}>
                                    <form
                                        id="form-whatsapp-mobile"
                                        onSubmit={mobileForm.handleSubmit(handleSendOtp)}
                                        className="space-y-4 font-semibold"
                                    >
                                        <FormField
                                            control={mobileForm.control}
                                            name="mobile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Registered Mobile Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="input-whatsapp-mobile"
                                                            placeholder="Enter 10-digit mobile number"
                                                            maxLength={10}
                                                            inputMode="numeric"
                                                            {...field}
                                                            onChange={(e) => {
                                                                // Allow only digits
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                field.onChange(val);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            id="btn-send-otp"
                                            type="submit"
                                            loading={sendWhatsappOtp.isPending || sendWhatsappOtp.isLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Send OTP on WhatsApp
                                        </Button>
                                    </form>
                                </Form>
                            )}

                            {/* ── Step 2: OTP Verification ─────────────────────── */}
                            {otpStep === 'otp' && (
                                <Form {...otpForm}>
                                    <form
                                        id="form-whatsapp-otp"
                                        onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                                        className="space-y-4 font-semibold"
                                    >
                                        {/* Mobile number display */}
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                            <div>
                                                <p className="text-xs text-gray-500 font-normal">OTP sent to</p>
                                                <p className="text-sm font-semibold text-gray-800">+91 {otpMobile}</p>
                                            </div>
                                            <button
                                                id="btn-change-mobile"
                                                type="button"
                                                onClick={() => {
                                                    setOtpStep('mobile');
                                                    setOtpError('');
                                                    setOtpSuccess('');
                                                    otpForm.reset();
                                                }}
                                                className="text-xs text-blue-600 hover:underline font-medium"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        {/* OTP expiry countdown */}
                                        {otpExpiresAt && (
                                            <div className="flex justify-center">
                                                <CountdownTimer targetDate={otpExpiresAt} label="OTP expires in" />
                                            </div>
                                        )}

                                        <FormField
                                            control={otpForm.control}
                                            name="otp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Enter OTP</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="input-otp"
                                                            placeholder="Enter 6-digit OTP"
                                                            maxLength={6}
                                                            inputMode="numeric"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                field.onChange(val);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            id="btn-verify-otp"
                                            type="submit"
                                            loading={verifyWhatsappOtp.isPending || verifyWhatsappOtp.isLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Verify &amp; Login
                                        </Button>

                                        {/* Resend OTP */}
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            {canResend ? (
                                                <button
                                                    id="btn-resend-otp"
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={resendWhatsappOtp.isPending || resendWhatsappOtp.isLoading}
                                                    className="text-sm text-blue-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {(resendWhatsappOtp.isPending || resendWhatsappOtp.isLoading)
                                                        ? 'Resending...'
                                                        : 'Resend OTP'}
                                                </button>
                                            ) : (
                                                <CountdownTimer
                                                    targetDate={resendAvailableAt}
                                                    label="Resend available in"
                                                />
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default SignIn;
