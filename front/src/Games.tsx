import React, {useState} from "react";
//import useInput from "./hooks/useInput";

type Props = {
    io: SocketIOClient.Socket;
};

/*
type Player_1 = {
  name_player_1?: string;
  number_player_1?: number;
};

type Player_2 = {
  name_player_2?: string;
  number_player_2?: number;
};
 */

export default function Games({io}: Props): JSX.Element {
    // const [player_1, setPlayer_1,] = useState<Player_1>();
    //const [player_2, setPlayer_2,] = useState<Player_2>();
    const [name_player, setNamePlayer] = useState('');
    const [score_player, setScorePlayer] = useState(0);
    const [message, setMessage] = useState('');
    const [start, setStart] = useState(false)
    const [status_score, setStatusScore] = useState(0);

    const handleNickname = () => {
        io.on("game::start", ({score}: { score: number }) => {
            if (name_player !== "") {
                setStart(true)
            }
        });

        io.emit("game::sendNickname", JSON.stringify({name_player}));
    };

    const validateScore = () => {
        io.on("game::start", ({score}: { score: number }) => {
            if (score_player === 0) {
                setMessage('Veuillez saisir un nombre')
            } else if (score_player < score) {
                setMessage('Votre nombre est trop petit')
            } else if (score_player > score) {
                setMessage('Votre nombre est trop grand')
            } else if (score_player === score) {
                setStatusScore(1)
                console.log(name_player);
                setMessage('Vous avez trouvé le nombre et vous gagné 1 points')
            }
        });
            io.emit("game::sendPoint", JSON.stringify({name_player, status_score}));
    };


    return (
        <div className="m-auto">
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded-lg px-8 py-8 m-4">
                    {!start ? (
                            <>
                                <div className="mb-4">
                                    <label className="block text-black text-md font-bold mb-2">
                                        Veuillez saisir le nom du joueur
                                    </label>
                                    <input
                                        className="shawod appearance-none border rounded py-2 px-4"
                                        placeholder="Sephiroth"
                                        onChange={e => setNamePlayer(e.target.value)}/>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <button
                                        className="bg-blue-800 hover:bg-red-800 text-white px-2 py-2 rounded-md"
                                        type="button"
                                        onClick={() => handleNickname()}
                                    >
                                        start
                                    </button>
                                </div>
                            </>)
                        :
                        (
                            <>
                                <div className="mb-4">
                                    <label className="block text-black text-md font-bold mb-2">
                                        {`Hello ${name_player}`}
                                    </label>
                                    <label className="block text-black text-md font-bold mb-2">
                                        Veuillez un nombre entre 1 et 2000
                                    </label>
                                    <label className="block text-black text-md font-bold mb-2">
                                        {message}
                                    </label>
                                    <input
                                        className="shawod appearance-none border rounded py-2 px-4"
                                        placeholder="Score"
                                        onChange={e => setScorePlayer(parseInt(e.target.value))}
                                    />
                                    <div className="flex items-center justify-between w-full">
                                        <button
                                            className="bg-blue-800 hover:bg-red-800 text-white px-2 py-2 rounded-md"
                                            type="button"
                                            onClick={() => validateScore()}
                                        >
                                            valider
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </form>
            </div>
        </div>
    );
}