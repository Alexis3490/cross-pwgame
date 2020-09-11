import React, {useState} from "react";
import {InputGroup, InputGroupAddon, Label,Input, Button} from 'reactstrap';


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
    const [compteur_player, setCompteurPlayer] = useState(0);
    const [status_games, setStatusGames] = useState(0);

    const [message, setMessage] = useState('');
    const [start, setStart] = useState(false)

        const handleNickname = () => {
        io.on("game::start", ({score}: { score: number }) => {
            if (name_player !== "") {
                setStart(true)
            }
        });

        io.emit("game::sendNickname", JSON.stringify({name_player}));
    };

    const validateScore = () => {
        io.on("game::start", ({score}: {score: number}) => {
            if (score_player === 0) {
                setMessage('Veuillez saisir un nombre')
            } else if (score_player < score) {
                setMessage('Votre nombre est trop petit')
            } else if (score_player > score) {
                setMessage('Votre nombre est trop grand')
            } else if (score_player === score) {
                setMessage('Vous avez trouvé le nombre et vous gagné 1 points')
                if(compteur_player === 0)
                {
                    setCompteurPlayer(1)
                }
            else
                {
                    setCompteurPlayer(compteur_player+1)
                }
            if(compteur_player === 2)
            {
                setMessage(`Le joueur ${name_player} à gagner la partie`)
                setStatusGames(1)
            }
            }
        });
            io.emit("game::sendPoint", JSON.stringify({name_player, score_player}));
    };

    const newGames = () => {
        io.on("game::start", ({score}: { score: number }) => {
            setStatusGames(0);
        });

        io.emit("game::newGames", JSON.stringify({}));
    };


    return (
        <div className="">
                <form className="">
                    {!start ? (
                            <>
                                <div className="mb-4">
                                    <Label style={{fontWeight: "bold"}}>
                                        Veuillez saisir le nom du joueur
                                    </Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                        </InputGroupAddon>
                                        <Input placeholder="Sephiroth"
                                               onChange={e => setNamePlayer(e.target.value)}/>
                                    </InputGroup>
                                </div>
                                    <Button color="primary"
                                        type="button"
                                        onClick={() => handleNickname()}
                                    >
                                        Start
                                    </Button>
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
                                        {status_games === 0 ?
                                            (
                                                <button
                                                    className="bg-blue-800 hover:bg-red-800 text-white px-2 py-2 rounded-md"
                                                    type="button"
                                                    onClick={() => validateScore()}
                                                >
                                                    valider
                                                </button>
                                            )
                                            : (
                                                <button
                                                    className="bg-blue-800 hover:bg-red-800 text-white px-2 py-2 rounded-md"
                                                    type="button"
                                                    onClick={() => newGames()}
                                                >
                                                    new games
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                </form>
        </div>
    );
}