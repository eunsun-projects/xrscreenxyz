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
									<div className="opacity-80 w-[63%] h-[80%] bg-contain bg-no-repeat bg-center bg-[url(/assets/svgs/Mouse.svg)]" />
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
									<div className="opacity-80 w-full h-[50%] bg-contain bg-no-repeat bg-center bg-[url(/assets/svgs/Keyboard.svg)]"></div>
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

							<div
								className={cn(
									"absolute flex justify-center items-center text-shadow-white text-white w-[7rem] h-[3rem] bg-white/30 transition-all duration-1000 cursor-pointer z-50 text-[1.2rem]",
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
							</div>
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
