import { Button } from "@/components/ui/button";
import axios from "axios";

export default function TerraApi(props: {
	callback: (x: any) => void,
}) {

	return (
		<Button
			onClick={async e => {
				e.preventDefault();
				const data = (await axios.get("http://localhost:3000/api/generateWidgetSession")).data.data;
				window.open(data.url, "_blank");
				props.callback(data);
			}}
			className="text-xl p-8"
		>
			Open TerraAPI
		</Button>
	);
}
