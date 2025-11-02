import React, { useEffect, useState } from 'react'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { useQuery } from '@tanstack/react-query';
import { apiBankerByBankerId, apiBankerCitiesByStateName, apiBankersByBank, apiBanksByCity } from '@/services/lead.api';
import { Alert } from '../ui/alert';
import { getErrorMessage } from '@/lib/helpers/get-message';

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];



const BankerDetails = ({ form, leadId }) => {

    const [selectedState, setSelectedState] = useState(null);
    const [bankerCities, setBankerCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [bankers, setBankers] = useState([]);
    const [selectedBanker, setSelectedBanker] = useState(null);
    const [bankerDetails, setBankerDetails] = useState(null);

    // Query: Fetch cities when state changes
    const {
        isError: isCitiesError,
        error: citiesError,
    } = useQuery({
        queryKey: [selectedState],
        enabled: !!selectedState,
        queryFn: async () => {
            const res = await apiBankerCitiesByStateName({ "stateName": selectedState });
            console.log("📦 queryFn response of fetching banker cities when state change:", res);
            setBankerCities(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching cities:", err);
        }
    });

    console.log("banker cities>>>", bankerCities);


    // Query: Fetch banks list when city changes
    const {
        isError: isBanksError,
        error: banksError,
    } = useQuery({
        queryKey: [selectedCity],
        enabled: !!selectedCity,
        queryFn: async () => {
            const res = await apiBanksByCity({ "cityId": selectedCity, leadId });
            console.log("📦 queryFn response of fetching bank names when city change:", res);
            setBanks(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching banks:", err);
        }
    });

    console.log("Banks names >>>", banks);

    // Query: Fetch bankers list when bank changes
    const {
        isError: isBankersError,
        error: bankersError,
    } = useQuery({
        queryKey: [selectedBank],
        enabled: !!selectedBank,
        queryFn: async () => {
            const res = await apiBankersByBank({ "cityId": selectedCity, leadId, "bankId": selectedBank });
            console.log("📦 queryFn response of fetching bankers when bank change:", res);
            setBankers(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching bankers:", err);
        }
    });

    console.log("bankers>>>>", bankers);

    // Query: Fetch bankers list when bank changes
    const {
        isError: isBankerDetailsError,
        error: bankerDetailsError,
    } = useQuery({
        queryKey: [selectedBanker],
        enabled: !!selectedBanker,
        queryFn: async () => {
            const res = await apiBankerByBankerId({ "bankerId": selectedBanker });
            console.log("📦 queryFn response of fetching banker details when banker selected:", res);
            setBankerDetails(res?.data?.data || []);
            return res;
        },
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            console.log("data >>", res);
        },
        onError: (err) => {
            console.error("Error fetching banker details:", err);
        }
    });

    console.log("banker details >>>", bankerDetails);

    useEffect(() => {
        if (bankerDetails) {
            form.setValue("bankerDesignation", bankerDetails?.designation || "");
            form.setValue("bankerMobileNo", bankerDetails?.mobile || "");
            form.setValue("bankerEmailId", bankerDetails?.email || "");
        }
    }, [bankerDetails, form]);

    return (
        <>
            <div className="bg-sky-300 text-slate-900 font-medium px-3 py-2 rounded my-4">
                Banker Details
            </div>

            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2  p-2 border border-gray-200 shadow mt-3 rounded '>

                {isCitiesError && (
                    <Alert variant="destructive">{getErrorMessage(citiesError)}</Alert>
                )}
                {isBanksError && (
                    <Alert variant="destructive">{getErrorMessage(banksError)}</Alert>
                )}
                {isBankersError && (
                    <Alert variant="destructive">{getErrorMessage(bankersError)}</Alert>
                )}
                {isBankerDetailsError && (
                    <Alert variant="destructive">{getErrorMessage(bankerDetailsError)}</Alert>
                )}

                <FormField
                    control={form.control}
                    name="bankStateName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State Name <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedState(value);
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {indianStates.map((state) => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bankCityName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City Name <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={(cityId) => {
                                    const selectedCityObj = bankerCities.find((city) => city._id === cityId);

                                    // 1️⃣ update form field with the city name
                                    field.onChange(selectedCityObj?.cityName || "");

                                    // 2️⃣ store cityId in local state for further API calls
                                    setSelectedCity(cityId);
                                }}
                                value={bankerCities.find((c) => c.cityName === field.value)?._id || ""}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {bankerCities.map((city) => (
                                        <SelectItem key={city?._id} value={city?._id}>
                                            {city?.cityName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bank Name <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={(bankId) => {
                                    const selectedBankObj = banks.find((bank) => bank._id === bankId);

                                    // 1️⃣ update form field with the bank name
                                    field.onChange(selectedBankObj?.name || "");

                                    // 2️⃣ store bankId in local state for further API calls
                                    setSelectedBank(bankId);
                                }}
                                value={banks.find((c) => c.name === field.value)?._id || ""}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {banks.map((bank) => (
                                        <SelectItem key={bank?._id} value={bank?._id}>
                                            {bank?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="bankerId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Banker Name <span className="text-red-500">*</span>
                            </FormLabel>

                            <Select
                                onValueChange={(bankerId) => {

                                    // ✅ Store only bankerId in form
                                    field.onChange(bankerId);

                                    // ✅ Optional: set local state if needed
                                    setSelectedBanker(bankerId);

                                }}
                                value={field.value} // bankerId is stored here
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Select"
                                        // ✅ Show the name based on current bankerId
                                        >
                                            {bankers.find((b) => b._id === field.value)?.bankerName || "Select"}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {bankers.map((banker) => (
                                        <SelectItem key={banker._id} value={banker._id}>
                                            {banker.bankerName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="bankerDesignation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Banker Designation <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input {...field}
                                    readOnly
                                    className="p-2 border rounded bg-gray-100 text-gray-600 outline-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bankerMobileNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Banker Mobile No <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input {...field}
                                    readOnly
                                    className="p-2 border rounded bg-gray-100 text-gray-600 outline-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bankerEmailId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Banker Email Id <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input {...field}
                                    readOnly
                                    className="p-2 border rounded bg-gray-100 text-gray-600 outline-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lanApplicationNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lan no/Application No <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="disbursalDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Disbursal Date <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </div>
        </>
    )
}

export default BankerDetails
