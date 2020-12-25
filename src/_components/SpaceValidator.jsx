import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BASE_API_URL } from "../env";
import axios from "axios";
import { Colors } from "../constants";
import Center from "./Center";
import FullPageLoader from "./FullPageLoader";

const useStyles = makeStyles((theme) => ({
	page: {
		width: "100vw",
		height: "100vh",
		backgroundColor: Colors.LIGHT_SHADE,
	},
}));

export default function SpaceValidator(props) {
	const cls = useStyles();
	const [loading, setLoading] = useState(true);
	const [exists, setExists] = useState(false);
	const [reachedUserLimit, setReachedUserLimit] = useState(false);

	const [code, setCode] = useState("");

	useEffect(() => {
		let pathArr = window.location.href.split("/");
		console.log(pathArr[pathArr.length - 1]);
		setCode(pathArr[pathArr.length - 1]);
	}, []);

	useEffect(() => {
		if (code) {
			axios
				.get(`${BASE_API_URL}/api/v4/spaces/${code}`)
				.then((response) => {
					const { space } = response.data;
					setExists(true);
					if (space.users.length >= space.maxUsers) {
						setReachedUserLimit(true);
					}
				})
				.catch((err) => {
					if (!err.response) {
						console.log(err);
						return;
					} else if (err.response.status === 404) {
						// Space not found
						setExists(false);
					}
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [code]);

	if (loading) {
		return <FullPageLoader />;
	} else if (reachedUserLimit) {
		return (
			<div className={cls.page}>
				<Center>
					<p style={{ opacity: 0.5 }}>
						<span role="img" aria-label="Frowny face emoji" aria-labelledby="Frowny face emoji">
							🙁{" "}
						</span>
						Oops!
					</p>
					<p style={{ opacity: 0.5 }}>The space you are trying to join has already reached its max user limit.</p>
				</Center>
			</div>
		);
	} else if (exists) {
		return props.children;
	} else {
		return (
			<div className={cls.page}>
				<Center>
					<p style={{ opacity: 0.5 }}>
						<span role="img" aria-label="Frowny face emoji" aria-labelledby="Frowny face emoji">
							🙁{" "}
						</span>
						Oops!
					</p>
					<p style={{ opacity: 0.5 }}>It seems that the space you are trying to access does not exist. </p>
					<p style={{ opacity: 0.5 }}>Please double check the code.</p>
				</Center>
			</div>
		);
	}
}
