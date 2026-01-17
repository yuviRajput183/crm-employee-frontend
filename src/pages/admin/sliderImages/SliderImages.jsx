import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
import slider from "@/assets/images/slider.png"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSlider } from '@/lib/hooks/useSlider';
import { Alert } from '@/components/ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';

const sliderSchema = z.object({
    firstImage: z.any().optional(),
    secondImage: z.any().optional(),
    thirdImage: z.any().optional(),
    fourthImage: z.any().optional(),
    fifthImage: z.any().optional(),
});

const SliderImages = () => {

    const { addSliderImages, fetchSliders } = useSlider();
    const { mutateAsync, isPending: isLoading, isError, error } = addSliderImages;
    const { data: sliderData } = fetchSliders;

    const [existingImages, setExistingImages] = useState({
        slider1: null,
        slider2: null,
        slider3: null,
        slider4: null,
        slider5: null,
    });

    const form = useForm({
        resolver: zodResolver(sliderSchema),
        defaultValues: {
            firstImage: null,
            secondImage: null,
            thirdImage: null,
            fourthImage: null,
            fifthImage: null,
        },
    });

    useEffect(() => {
        if (sliderData?.data?.data && sliderData.data.data.length > 0) {
            const sliders = sliderData.data.data[0]; // Assuming one slider document for the user/admin
            setExistingImages({
                slider1: sliders.slider1 || null,
                slider2: sliders.slider2 || null,
                slider3: sliders.slider3 || null,
                slider4: sliders.slider4 || null,
                slider5: sliders.slider5 || null,
            });
        }
    }, [sliderData]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            if (data.firstImage && data.firstImage[0]) formData.append("slider1", data.firstImage[0]);
            if (data.secondImage && data.secondImage[0]) formData.append("slider2", data.secondImage[0]);
            if (data.thirdImage && data.thirdImage[0]) formData.append("slider3", data.thirdImage[0]);
            if (data.fourthImage && data.fourthImage[0]) formData.append("slider4", data.fourthImage[0]);
            if (data.fifthImage && data.fifthImage[0]) formData.append("slider5", data.fifthImage[0]);

            // Check if any file is selected
            let hasFile = false;
            for (let pair of formData.entries()) {
                hasFile = true;
                break;
            }

            if (!hasFile) {
                alert("Please select at least one image to upload.");
                return;
            }

            const res = await mutateAsync(formData);
            console.log('✅ sliders updated successfully:', res);

            form.reset(); // clear form inputs
            if (res?.data?.success) {
                // alert(res?.data?.message);
                // No need to reload, react-query should start refetch if we invalidate queries
            }

        } catch (err) {
            console.error('❌ Error adding slider images:', err);
        }
    };

    const renderImageField = (fieldName, label, sliderKey) => (
        <div className="w-full md:w-1/2">
            <FormField
                control={form.control}
                name={fieldName}
                render={({ field: fileField }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                onChange={(e) => fileField.onChange(e.target.files)}
                                className="border border-gray-400 rounded-md p-2 w-full file:mr-4 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*"
                            />
                        </FormControl>
                        <FormMessage />
                        {existingImages[sliderKey] && (
                            <div className="mt-2">
                                {/* <p className="text-xs text-gray-500 mb-1">Current Image:</p> */}
                                <a
                                    href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/uploads/sliders/${existingImages[sliderKey]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm hover:text-blue-800"
                                >
                                    {existingImages[sliderKey]}
                                </a>
                            </div>
                        )}
                    </FormItem>
                )}
            />
        </div>
    );

    return (
        <div className=" p-3 bg-white rounded shadow">
            {/* Heading */}
            <div className=' flex gap-2 items-center pb-2 border-b-2 '>
                <Avatar>
                    <AvatarImage src={slider} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className=' text-2xl text-bold'>Slider Images</h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 p-2 border mt-3 border-gray-300 rounded-md"
                >
                    {isError && (
                        <Alert variant="destructive">{getErrorMessage(error)}</Alert>
                    )}

                    {/* File Upload Fields */}
                    {renderImageField("firstImage", "First Slider Image", "slider1")}
                    {renderImageField("secondImage", "Second Slider Image", "slider2")}
                    {renderImageField("thirdImage", "Third Slider Image", "slider3")}
                    {renderImageField("fourthImage", "Fourth Slider Image", "slider4")}
                    {renderImageField("fifthImage", "Fifth Slider Image", "slider5")}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="bg-blue-950 hover:bg-blue-400 text-white"
                            loading={isLoading}
                        >
                            Save
                        </Button>
                    </div>

                    {/* Image Note */}
                    <p className="text-red-600 text-xs font-bold">
                        Slider image should be in 800 X 400.
                    </p>
                </form>
            </Form>

        </div>
    )
}

export default SliderImages;
