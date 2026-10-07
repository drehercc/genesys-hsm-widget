import { useEffect, useRef } from "react";

export default function AuthPopup() {
    const authCalled = useRef(false)

    useEffect(() => {
        const autoCloseDelay = 100000;

        const messageTargetOrigin = "https://homomorphous-bibi-subradular.ngrok-free.dev";

        const start = () => {
            authCalled.current = true

            try {
                const authMessage = {
                    name: "gc_auth_popup",
                    type: "message",
                    hash: window.location.hash || "",
                    search: window.location.search || "",
                };

                if (!window.opener) {
                    console.error("Not a popup window");
                    return;
                }
                console.log("AUTH POP_UP ABERTO")
                console.log(authMessage)
                window.opener.postMessage(
                    authMessage,
                    messageTargetOrigin
                );

                setTimeout(() => {
                    window.close();
                }, autoCloseDelay);

            } catch (err) {
                console.error("Error:", err);
            }
        };

        if (!authCalled.current) {
            start();
        }

    }, []);

    return <div>Authentication Popup...</div>;
}