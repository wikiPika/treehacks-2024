"use client";

import { useState } from "react";
import { useData } from "./DataContext";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { useTTS } from "./TTSContext";
import TerraApi from "./TerraApi";
import { Checkbox } from "@/components/ui/checkbox";
import Joyride from "react-joyride";
import { useOpenAI } from "./OpenAIContext";

const onboardingSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	yob: z.coerce
		.number({
			required_error: "You forgot to fill out your birth year.",
		})
		.lt(2024)
		.int({ message: "Year should be a whole number." }),
	mob: z.coerce
		.number({
			required_error: "You forgot to fill out your birth month.",
		})
		.gte(1)
		.lte(12)
		.int({ message: "Month should be a whole number." }),
	dob: z.coerce
		.number({
			required_error: "You forgot to fill out your birth day.",
		})
		.gte(1)
		.lte(31)
		.int({ message: "Day should be a whole number." }),
	heartDisease: z.boolean().optional(),
	diabetes: z.boolean().optional(),
	lungDisease: z.boolean().optional(),
	alzheimers: z.boolean().optional(),
	osteoporosis: z.boolean().optional(),
	arthritis: z.boolean().optional(),
	smoking: z.boolean().optional(),
	drinking: z.boolean().optional(),
});

const steps = ["Basic information", "Health tracking", "Medical history"];

export default function Onboarding() {
	const { setOnboarded } = useData();
	const [page, setPage] = useState(0);
	const [touring, setTouring] = useState(false);
	const [seq, setSeq] = useState(0);

	// 0 - start
	// 1 - nutrition
	// 2 - health
	const form = useForm<z.infer<typeof onboardingSchema>>({
		resolver: zodResolver(onboardingSchema),
		mode: "onChange",
	});

	const onSubmit = (values: z.infer<typeof onboardingSchema>) => {
		setOnboarded(true);
	};

	const { speak } = useTTS();
	const { chug } = useOpenAI();

	const generate = (prompt: string, val: any, response: string) => {
		return () => {
			const s = new webkitSpeechRecognition() || new SpeechRecognition();

			s.lang = "en-US";
			(s.interimResults = false),
				(s.onresult = e => {
					const transcript = e.results[e.resultIndex][0].transcript;
					chug(`${prompt}\n\n${transcript}`, (result: string) => {
						form.setValue(val, result);
						speak(`${response}${result}`, () => {
							setSeq(seq + 1);
						});
					});
				});

			s.start();
		};
	};

	const tourSteps = [
		{
			target: "#onboard-tell-more",
			content: "Welcome to Fudu! This form will ask you some questions.",
			disableBeacon: true,
		},
		{
			target: "#onboard-first-name",
			content: "What's your first name?",
		},
		{
			target: "#onboard-last-name",
			content: "How about your last name?",
		},
		{
			target: "#onboard-yob",
			content: "In which year were you born?",
		},
		{
			target: "#onboard-mob",
			content: "In which month were you born?",
		},
		{
			target: "#onboard-dob",
			content: "On which day were you born?",
		},
		{
			target: "#onboard-next",
			content: "Let's keep on going",
		},
		{
			target: "#onboard-next",
			content: "TerraAPI was a planned feature and had to be scrapped. Let's keep on going.",
		},
		{
			target: "#onboard-checkboxes",
			content: "Tell me about your preexisting health conditions.",
		},
	];

	const callbacks = [
		() => {
			setSeq(seq + 1);
		},
		generate(
			"Below is a transcript of a person saying their first name. Please tell me their first name and only their first name.",
			"firstName",
			"Hello, "
		),
		generate(
			"Below is a transcript of a person saying their last name. Please tell me their last name and only their last name.",
			"lastName",
			"I see your last name is "
		),
		generate(
			"Below is a transcript of a person saying the year of their birth. Please tell me the year of their birth as a four-digit number, and only that four-digit number",
			"yob",
			"You were born in the year "
		),
		generate(
			"Below is a transcript of a person saying the month of their birth. Please tell me the month of their birth as a two-digit number, and only that two-digit number. January should correspond with 1, Februrary with 2, and so on.",
			"mob",
			"You were born in month number "
		),
		generate(
			"Below is a transcript of a person saying the day of their birth. Please tell me the day of their birth as a two-digit number, and only that two-digit number. For example, 23rd should be converted to 23.",
			"dob",
			"You were born on day "
		),
		() => {
			setSeq(seq + 1);
			setPage(page + 1);
		},
		() => {
			setSeq(seq + 1);
			setPage(page + 1);
		},
		generate(
			"Below is a transcript of a person discussing the previous health conditions they have. Please return the health conditions they have as strings in an array. Your reply should be a valid JSON array.",
			"",
			"I understand that you have "
		),
	];

	return (
		<div className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center overflow-hidden">
			<Joyride
				steps={tourSteps}
				showSkipButton
				continuous
				stepIndex={seq}
				callback={e => {
					console.log(e);
					if (e.action === "update") {
						if (e.step.content) {
							speak(e.step.content as string, callbacks[e.index % callbacks.length]);
						}
					} else if (e.action === "reset") {
						setTouring(false);
					}
				}}
				run={touring}
			/>
			<div className="flex flex-row p-8 gap-8">
				<Card className="w-96 h-160 py-4">
					<CardContent className="px-0 py-4 flex flex-col h-full justify-between">
						<div className="flex flex-col w-full items-stretch gap-4">
							{steps.map((v, i) => (
								<button
									className={
										"px-8 py-4 text-xl cursor-pointer text-left " + (page == i ? "bg-slate-200" : "hover:bg-slate-100")
									}
									onClick={() => setPage(i)}
									key={"onboard-step-" + i}
								>
									<h1 className="font-bold mb-1">Step {i + 1}</h1>
									<p>{v}</p>
								</button>
							))}
						</div>
						<div className="px-8 w-full flex flex-col gap-2">
							<Button
								className="w-full py-8 flex flex-row gap-2 items-center text-xl"
								onClick={e => {
									e.preventDefault();
									setTouring(true);
								}}
							>
								<Mic size={32} />
								Voice Assistance
							</Button>
						</div>
					</CardContent>
				</Card>
				<Card className="w-160 h-160 p-2 flex flex-col">
					<CardHeader>
						<CardTitle
							className="text-5xl font-black"
							id="onboard-tell-more"
						>
							Tell us more about you.
						</CardTitle>
					</CardHeader>
					<CardContent className="grow flex flex-col justify-between">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex flex-col gap-4 grow justify-between"
							>
								{page === 0 && (
									<div className="flex flex-col gap-4">
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem className="grow">
													<div className="flex flex-row items-center gap-2">
														<FormLabel className="text-xl">First name</FormLabel>
														<FormMessage />
													</div>
													<FormControl>
														<Input
															id="onboard-first-name"
															className="text-xl p-8"
															placeholder="First name..."
															{...field}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem className="grow">
													<div className="flex flex-row items-center gap-2">
														<FormLabel className="text-xl">Last name</FormLabel>
														<FormMessage />
													</div>
													<FormControl>
														<Input
															id="onboard-last-name"
															className="text-xl p-8"
															placeholder="Last name..."
															{...field}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<div className="flex flex-row gap-4">
											<FormField
												control={form.control}
												name="yob"
												render={({ field }) => (
													<FormItem className="grow">
														<FormLabel className="text-xl">Birth year</FormLabel>
														<FormControl>
															<Input
																id="onboard-yob"
																className="text-xl p-8"
																placeholder="Year..."
																type="number"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="mob"
												render={({ field }) => (
													<FormItem className="grow">
														<FormLabel className="text-xl">Birth month</FormLabel>
														<FormControl>
															<Input
																id="onboard-mob"
																className="text-xl p-8"
																placeholder="Month..."
																type="number"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="dob"
												render={({ field }) => (
													<FormItem className="grow">
														<FormLabel className="text-xl">Birth day</FormLabel>
														<FormControl>
															<Input
																id="onboard-dob"
																className="text-xl p-8"
																placeholder="Day..."
																type="number"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}
								{page === 1 && (
									<div className="flex flex-col gap-4">
										<FormLabel className="text-xl">Link your wearable devices</FormLabel>
										<TerraApi
											callback={(x: any) => {
												console.log(x);
											}}
										/>
									</div>
								)}
								{page === 2 && (
									<div className="flex flex-col gap-4 flex-wrap">
										<FormLabel className="text-xl">Tell us about your eventual sources of death</FormLabel>
										<div
											className="flex flex-col flex-wrap gap-2"
											id="onboard-checkboxes"
										>
											<FormField
												control={form.control}
												name="heartDisease"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Heart Disease</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="diabetes"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Diabetes</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="lungDisease"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Lung Disease</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="alzheimers"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Alzheimer's</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="osteoporosis"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Osteoporosis</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="arthritis"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Arthritis</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="smoking"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Smoking</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="drinking"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-4 w-fit">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-xl font-regular">Drinking</FormLabel>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}
								<div className="w-full flex flex-row justify-between">
									{page != 0 ? (
										<Button
											onClick={e => {
												e.preventDefault();
												setPage(page - 1);
											}}
											disabled={page < length}
											className="text-xl p-8"
										>
											Back
										</Button>
									) : (
										<div />
									)}
									{page != steps.length - 1 ? (
										<Button
											onClick={e => {
												e.preventDefault();
												setPage(page + 1);
											}}
											disabled={page > steps.length}
											className="text-xl p-8"
											id="onboard-next"
										>
											Next
										</Button>
									) : (
										<Button
											type="submit"
											className="text-xl p-8 bg-white text-black outline outline-2 outline-black hover:text-white"
										>
											Submit
										</Button>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
