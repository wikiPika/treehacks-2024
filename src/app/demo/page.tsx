"use client";

import { useData } from "@/ui/demo/DataContext";
import Onboarding from "@/ui/demo/Onboarding";
import Dashboard from "@/ui/demo/Dashboard";
import TTSProvider from "@/ui/demo/TTSContext";
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import OpenAIProvider from "@/ui/demo/OpenAIContext";

/*

TODO:

onboarding process
(food, restaurant) suggestions to complement diet
quick links to purchase items

*/
export default function Page() {
	const { onboarded, setOnboarded } = useData();

	return (
		<TTSProvider>
			<OpenAIProvider>
				<div className="min-h-screen flex flex-col w-full">
					{!onboarded && (
						<div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black">
							<SignedOut>
								<SignIn />
							</SignedOut>
							<SignedIn>
								<Onboarding />
							</SignedIn>
						</div>
					)}
					<Dashboard />
				</div>
			</OpenAIProvider>
		</TTSProvider>
	);
}
