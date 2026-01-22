"use client";

import Link from "next/link";
import { useState } from "react";
import { hubData } from "@/data/hub.data";
import { cn } from "@/utils/common";

const menuStyle =
	"border border-screen-green mx-auto pl-[0.2rem] h-[1.3rem] w-full flex items-center leading-none text-shadow-screen";

function HubTemplate() {
	const [isExampleOpen, setIsExampleOpen] = useState(false);

	const handleClickExample = () => {
		setIsExampleOpen(!isExampleOpen);
	};

	return (
		<>
			<div className="font-[1.3rem] w-[14rem] mt-[2rem]">
				<button className={menuStyle} onClick={handleClickExample}>
					<p className="text-[1rem]">PROEJECT_WEB</p>
				</button>
				<ul className={cn(isExampleOpen ? "block" : "hidden")}>
					{hubData.sample.map((item) => (
						<Link href={item.href} key={item.title}>
							<li className={cn(menuStyle, "my-[1rem]")}>{item.title}</li>
						</Link>
					))}
				</ul>
			</div>
			{/* <div className="font-[1.3rem] w-[14rem] mt-[2rem]">
        <button className={menuStyle} onClick={hanldeClickSpace}>
          <p className="text-[1rem]">PROEJECT_VR</p>
        </button>
        <ul className={cn(isSpaceOpen ? 'block' : 'hidden')}>
          {hubData.spaces.map((item) => (
            <Link href={item.href} key={item.title}>
              <li className={cn(menuStyle, 'my-[1rem]')}>{item.title}</li>
            </Link>
          ))}
        </ul>
      </div> */}
		</>
	);
}

export default HubTemplate;
