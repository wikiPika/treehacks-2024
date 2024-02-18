import { Card } from "@/components/ui/card";
import { useData } from "./DataContext";

export default function Dashboard() {
	const { data } = useData();

	return (
		<div className="w-full h-full grow flex flex-col items-center my-canvas">
			<div className="p-8 flex flex-col grow gap-4 xl:w-[80rem] w-full border-x-2 border-slate-100 h-full">
				<h1
					className="xl:text-6xl lg:text-5xl text-4xl text-white font-black"
					style={{
						textShadow: "2px 2px 0px black",
					}}
				>
					Hello, Jane Doe.
				</h1>
				<h2
					className="xl:text-2xl text-white font-bold"
					style={{
						textShadow: "2px 2px 0px black",
					}}
				>
					Try something new today.
				</h2>
				<div className="flex flex-col gap-4 mt-8">
					<h2
						className="xl:text-3xl text-white font-bold"
						style={{
							textShadow: "2px 2px 0px black",
						}}
					>
						Recipes
					</h2>
          <div className="h-64 w-full grid grid-cols-4 gap-x-4">
            <Card>

            </Card>
            <Card>
              
            </Card>
            <Card>
              
            </Card>
            <Card>
              
            </Card>
          </div>
				</div>
        <div className="flex flex-col gap-4 mt-8">
					<h2
						className="xl:text-3xl text-white font-bold"
						style={{
							textShadow: "2px 2px 0px black",
						}}
					>
						Takeout
					</h2>
          <div className="h-64 w-full grid grid-cols-4 gap-x-4">
            <Card>

            </Card>
            <Card>
              
            </Card>
            <Card>
              
            </Card>
            <Card>
              
            </Card>
          </div>
				</div>
			</div>
		</div>
	);
}
