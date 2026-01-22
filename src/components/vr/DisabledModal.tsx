"use client";

import { memo } from "react";
import styles from "@/styles/dropdown.module.css";
import useVrStore from "@/zustand/vr.store";

interface DisabledModalProps {
	enabled: boolean;
}

function DisabledModalComp({ enabled }: DisabledModalProps) {
	const { setModalState } = useVrStore();
	const handleExit = () =>
		setModalState({ type: null, isOpen: false, selectedTag: null });

	if (enabled) return null;

	return (
		<div className={styles.popup_overlay}>
			<div className={styles.popup_exit} onClick={handleExit}>
				x
			</div>
			<div className={styles.txtArea}>
				<div className={styles.txtTitleArea}>
					<h2 className={styles.txtEleT}>서비스가 종료되었습니다</h2>
				</div>
				<div className={styles.pArea}>
					<p className={styles.txtEleP}>서비스가 종료되었습니다.</p>
					<p className={styles.txtEleP}>문의: bdohhhhh@gmail.com</p>
				</div>
			</div>
		</div>
	);
}
const DisabledModal = memo(DisabledModalComp);
export default DisabledModal;
