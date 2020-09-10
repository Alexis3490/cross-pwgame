import React, {useState} from "react";
import SocketIo from "socket.io-client";

import "./tailwind.output.css";
import Joueurs from "./Joueurs";


export default function App(): JSX.Element {
    const [io, setIo] = useState<SocketIOClient.Socket>();

    const connectIoServer = () => {
        setIo(SocketIo(process.env.REACT_APP_HOSTNAME as string));
    };

    return (
        <div className="h-screen flex bg-blue-200">
            <div className="m-auto">
                <div className="flex items-center justify-between w-full">
                    {!io ? (
                        <button
                            className="bg-blue-800 hover:bg-red-800 text-white px-8 py-8 rounded-md"
                            type="button"
                            onClick={() => connectIoServer()}
                        >
                            Join the Games
                        </button>
                    ) : (
                        <div>
                            <Joueurs io={io}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}