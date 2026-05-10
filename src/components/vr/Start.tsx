"use client";

import Image from "next/image";
import { memo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { cn } from "@/utils/common";
import useVrStore, { type VrStore } from "@/zustand/vr.store";
import EnterLoader from "../loaders/EnterLoader";
import type { VrModel } from "../types/vr.type";

const mouseHelpText =
	"마우스 휠을 통해 줌 인 줌 아웃이 가능합니다.\n마우스 드래그를 통해 공간을 둘러볼 수 있습니다.";
const keyboardHelpText = "키보드 방향키를 통해 위치를 이동할 수 있습니다.";

interface HelpIconProps {
	className?: string;
}

function MouseHelpIcon({ className }: HelpIconProps) {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 135.748 179.361"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M38.748,130.861v-54a48.5,48.5,0,0,1,97,0v54a48.5,48.5,0,1,1-97,0Zm30.4-96.846a46.462,46.462,0,0,0-28.4,42.846v54a46.5,46.5,0,1,0,93,0v-54a46.526,46.526,0,0,0-64.6-42.846Zm17.6,41.346v-21h2v21Zm-27-10.5,8-8,8,8-8,8ZM0,48.855l1.87-.707,3.091,8.167c.332-1.136.9-2.91,1.786-5.15a80.406,80.406,0,0,1,8.076-15.283,78.045,78.045,0,0,1,16.45-17.742A80.1,80.1,0,0,1,56.925,4.759L49.408,1.867,50.126,0,61.154,4.243l-4.79,11.139-1.838-.789L58,6.52A78.231,78.231,0,0,0,32.509,19.712,76.063,76.063,0,0,0,16.481,37,78.452,78.452,0,0,0,8.608,51.9c-.869,2.209-1.426,3.954-1.743,5.037l7.529-3.189.779,1.841L4.293,60.2Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function KeyboardHelpIcon({ className }: HelpIconProps) {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 189 122"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M134,122V67h55v55Zm2-2h51V69H136Zm-69,2V67h55v55Zm2-2h51V69H69ZM0,122V67H55v55Zm2-2H53V69H2Zm155.393-18.163,9.428-6.558L157.37,88.3l1.187-1.609,11.7,8.631-11.72,8.152Zm-137.8-6.511,11.7-8.631L32.479,88.3l-9.451,6.974,9.428,6.558-1.142,1.642Zm67.1-5.233L88.3,88.907l6.974,9.451,6.558-9.428,1.642,1.142-8.152,11.72ZM67,55V0h55V55Zm2-2h51V2H69ZM85.7,32.48l8.631-11.7L102.479,32.5l-1.642,1.142-6.558-9.428L87.3,33.668Z"
				fill="currentColor"
			/>
		</svg>
	);
}

interface StartProps {
	model: VrModel;
}

function StartComp({ model }: StartProps) {
	const [open, setOpen] = useState(false);
	const { embed, isWebCompReady } = useVrStore(
		useShallow((state: VrStore) => ({
			embed: state.embed,
			isWebCompReady: state.isWebCompReady,
		})),
	);

	const handleStart = () => {
		if (embed.isEmbed && window.parent) {
			window.open(window.location.href);
		} else {
			setOpen(true);
		}
	};

	return (
		<div
			className={cn(
				"absolute w-dvw h-dvh m-0 p-0 overflow-hidden touch-none z-10 transition-opacity",
				!open ? "block" : "hidden",
			)}
		>
			<div className="relative h-full w-full duration-100 bg-transparent flex flex-col justify-center items-center z-20">
				<div className="text-center text-white text-4xl font-bold mx-auto break-keep">
					{model.title}
				</div>
				<div className="text-center h-[60%] w-full select-none pointer-events-none flex flex-col justify-center items-center">
					<div className={cn(embed.isEmbedMiddle ? "h-[70%]" : "h-full")}>
						<div
							className={cn(
								embed.isEmbed ? "hidden" : "flex",
								embed.isEmbedMiddle ? "h-[50%]" : "h-[80%]",
								"flex-row",
							)}
						>
							<div className="relative w-full h-full flex flex-col items-center">
								<div className="w-full h-full flex justify-center items-end">
									<MouseHelpIcon className="h-[80%] w-[63%] text-white opacity-80" />
								</div>
								<div className="w-full h-full flex justify-center">
									<div className="w-[60%] h-full flex items-center text-center">
										<p className="text-sm md:text-base w-full text-white whitespace-pre-line leading-5">
											{mouseHelpText}
										</p>
									</div>
								</div>
							</div>
							<div className="w-full h-full flex flex-col items-center">
								<div className="w-[60%] h-full flex items-end">
									<KeyboardHelpIcon className="h-[50%] w-full text-white opacity-80" />
								</div>
								<div className="w-full h-full flex justify-center">
									<div className="w-[60%] h-full flex items-center text-center">
										<p className="text-sm md:text-base w-full text-white whitespace-pre-line leading-5">
											{keyboardHelpText}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="w-full h-[10%] pt-[1.5rem] flex flex-col justify-center items-center">
							<EnterLoader isReady={isWebCompReady} />

							<button
								type="button"
								className={cn(
									"absolute flex justify-center items-center text-shadow-white text-white w-[7rem] h-[3rem] border-0 bg-white/30 transition-all duration-1000 cursor-pointer z-50 text-[1.2rem]",
									isWebCompReady
										? "pointer-events-auto opacity-100"
										: "pointer-events-none opacity-0",
									embed.isEmbedMiddle
										? "text-[1.5rem] w-[6rem] h-[2.5rem]"
										: "text-[1rem]",
									embed.isEmbed ? "w-[5rem] h-[2rem]" : "w-[7rem]",
								)}
								onClick={handleStart}
							>
								<p
									className={cn(
										isWebCompReady ? "opacity-100" : "opacity-0",
										"transition-opacity",
									)}
								>
									enter
								</p>
							</button>
						</div>
						{/* { mpModels.downLogo[0] && !embed && ( <div className={styles.basic_logo} style={{ backgroundImage : `url('${mpModels.lowLogoUrl}')`, backgroundSize : 'contain', backgroundRepeat : "no-repeat", backgroundPosition :"center"}}></div> )} */}
					</div>
				</div>
			</div>
			<div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
			<div className="absolute top-0 left-0 w-full h-full">
				<Image
					src={model.background}
					fill
					className="object-cover"
					sizes="100vw"
					priority
					alt="background image"
				/>
			</div>
		</div>
	);
}

const Start = memo(StartComp);
export default Start;
