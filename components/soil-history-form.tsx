"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Using Card from ui/card if available, otherwise just divs. Assuming ui/card exists given nextjs starter pattern.
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Define the schema for the soil history form
const soilHistorySchema = z.object({
    cropName: z.string().min(2, "Crop name is required"),
    issuesFaced: z.string().optional(),
    profit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Profit must be a valid positive number",
    }),
    loss: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Loss must be a valid positive number",
    }),
    landSize: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Size must be a valid positive number",
    }),
    cultivationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid date",
    }),
});

export type SoilHistoryData = z.infer<typeof soilHistorySchema>;

interface SoilHistoryFormProps {
    onSubmit: (data: SoilHistoryData) => void;
}

export function SoilHistoryForm({ onSubmit }: SoilHistoryFormProps) {
    const form = useForm<SoilHistoryData>({
        resolver: zodResolver(soilHistorySchema),
        defaultValues: {
            cropName: "",
            issuesFaced: "",
            profit: "0",
            loss: "0",
            landSize: "",
            cultivationDate: "",
        },
    });

    const handleSubmit = (data: SoilHistoryData) => {
        onSubmit(data);
    };

    const handleReset = () => {
        form.reset({
            cropName: "",
            issuesFaced: "",
            profit: "0",
            loss: "0",
            landSize: "",
            cultivationDate: "",
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Card className="border-green-200 dark:border-green-800 shadow-md">
                <CardHeader className="bg-green-50 dark:bg-green-950/30 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-300">Farming History</CardTitle>
                    <CardDescription>
                        Provide details about your previous cultivation to help us analyze better.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="cropName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Crop Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Wheat, Rice" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="landSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Land Size (Acres)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" placeholder="e.g. 5.5" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="cultivationDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date Cultivated</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="profit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profit (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormDescription>Approximate profit from this crop.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="loss"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loss (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormDescription>Approximate loss (if any).</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="issuesFaced"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Issues Faced</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe any pests, diseases, or weather issues..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 justify-end pt-4">
                                <Button type="button" variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white min-w-[120px]">
                                    Next Step
                                </Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
