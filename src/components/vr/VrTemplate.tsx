"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import useVrStore, { type VrStore } from "@/zustand/vr.store";
import type { VrModel } from "../types/vr.type";
import DisabledModal from "./DisabledModal";
import Dropdown from "./Dropdown";
import MpWebComp from "./MpWebComp";
import StartComp from "./Start";
import Video from "./Video";

interface VrTemplateProps {
	model: VrModel;
}

function VrTemplate({ model }: VrTemplateProps) {
	const { setEmbed } = useVrStore(
		useShallow((state: VrStore) => ({
			setEmbed: state.setEmbed,
		})),
	);

	useEffect(() => {
		if (window.innerHeight < 400 && window.parent)
			setEmbed({ isEmbed: true, isEmbedMiddle: false });
		if (window.innerHeight >= 400 && window.innerHeight <= 600)
			setEmbed({ isEmbed: false, isEmbedMiddle: true });
	}, [setEmbed]);

	return (
		<>
			<DisabledModal enabled={model.enabled} />
			{model.enabled && <Dropdown model={model} />}
			{model.enabled && model.video[0] && <Video model={model} />}
			{model.enabled && <StartComp model={model} />}
			{model.enabled && <MpWebComp model={model} />}
		</>
	);
}

export default VrTemplate;
