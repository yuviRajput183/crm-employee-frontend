import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
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

const sliderSchema = z.object({
    firstImage: z.any().refine((file) => file?.[0] instanceof File, {
        message: "First slider image is required",
    }),
    secondImage: z.any().refine((file) => file?.[0] instanceof File, {
        message: "Second slider image is required",
    }),
    thirdImage: z.any().refine((file) => file?.[0] instanceof File, {
        message: "Third slider image is required",
    }),
    fourthImage: z.any().refine((file) => file?.[0] instanceof File, {
        message: "Fourth slider image is required",
    }),
    fifthImage: z.any().refine((file) => file?.[0] instanceof File, {
        message: "Fifth slider image is required",
    }),
});



const SliderImages = () => {

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

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("firstImage", data.firstImage[0]);
        formData.append("secondImage", data.secondImage[0]);
        formData.append("thirdImage", data.thirdImage[0]);
        formData.append("fourthImage", data.fourthImage[0]);
        formData.append("fifthImage", data.fifthImage[0]);

        console.log("FormData ready for upload!");
        // Use fetch/axios to send formData to backend
    };



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
                    {/* File Upload Fields */}
                    {[
                        { label: "First Slider Image", name: "firstImage" },
                        { label: "Second Slider Image", name: "secondImage" },
                        { label: "Third Slider Image", name: "thirdImage" },
                        { label: "Fourth Slider Image", name: "fourthImage" },
                        { label: "Fifth Slider Image", name: "fifthImage" },
                    ].map((field, idx) => (
                        <div key={idx} className="w-full md:w-1/2">
                            <FormField
                                control={form.control}
                                name={field.name}
                                render={({ field: fileField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                onChange={(e) => fileField.onChange(e.target.files)}
                                                className="border border-gray-400 rounded-md p-2 w-full file:mr-4 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="bg-blue-950 hover:bg-blue-400 text-white"
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
