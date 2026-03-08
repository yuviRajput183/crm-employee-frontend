import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation } from '@tanstack/react-query';
import { apiChangePassword } from '@/services/user.api';
import { getErrorMessage } from '@/lib/helpers/get-message';
import { Alert } from '@/components/ui/alert';
import { KeySquare } from 'lucide-react';

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old Password is required'),
    newPassword: z.string().min(6, 'New Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ChangePassword = () => {
    const [successMessage, setSuccessMessage] = React.useState('');

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const { mutateAsync, isLoading, isError, error } = useMutation({
        mutationFn: apiChangePassword,
        onSuccess: (res) => {
            if (res.data.success) {
                const msg = res.data.message || "Password changed successfully";
                setSuccessMessage(msg);
                alert(msg);
                form.reset();
                // Clear success message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        },
        onError: (err) => {
            setSuccessMessage('');
            console.error("Change password error:", err);
        }
    });

    const onSubmit = async (data) => {
        try {
            setSuccessMessage('');
            await mutateAsync(data);
        } catch (err) {
            // Error handled by mutation state
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b mb-6">
                <Avatar className="w-10 h-10 border">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-semibold text-gray-800">Change Password</h1>
            </div>

            {isError && (
                <Alert variant="destructive" className="mb-6 max-w-lg">
                    {getErrorMessage(error)}
                </Alert>
            )}

            {successMessage && (
                <div className="mb-6 max-w-lg p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6 p-6 border rounded-lg shadow-sm">

                    {/* Old Password */}
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-gray-800">Old Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* New Password */}
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-gray-800">New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirm Password */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-gray-800">Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-700 hover:bg-blue-800 text-white min-w-[100px]"
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ChangePassword;
