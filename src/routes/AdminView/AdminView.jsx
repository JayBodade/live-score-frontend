import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import AdminControl from '../../components/AdminControl'
import OverList from '../../components/OverList'
import { socket } from '../../socket'
import { useNavigate } from 'react-router-dom'
const AdminView = () => {

    const [currentBall, setCurrentBall] = useState(0);
    const [runs, setRuns] = useState(0);
    const [overNo, setOverNo] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [overArr, setOverArr] = useState([1]);
    const [overValue, setOverValue] = useState({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' })
    const [lastThreeOvers, setLastThreeOvers] = useState([{ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' }]);
    const [moveValue, setMoveValue] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/adminlogin');
      };
    
      const handleNewMatch = () => {
       localStorage.removeItem('matchId');
       setCurrentBall(0);
       setLastThreeOvers([{ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' }]);
       setOverArr([1]);
       setMoveValue(0);
       setOverNo(0);
       setOverValue({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' })
       setRuns(0);
       setWickets(0);

       socket.emit('startingNewMatchFromAdmin')
       
       

      };


    const getMatchDataFromDB = async () => {

      
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/getMatchData`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                id: localStorage.getItem('matchId'),
            },

        });

        const json = await response.json();

        if (json.success) {
            setRuns(json.matchData.totalRuns);
            setWickets(json.matchData.totalWickets);
            setCurrentBall(json.matchData.ballNo);
            setOverNo(json.matchData.overNo);
            setOverValue(json.matchData.currentOver);
            setLastThreeOvers(json.matchData.allOvers.splice(-3));
            setMoveValue(json.matchData.moveValue);
            let newlastThreeOvers = [];
            let min = Math.min(json.matchData.overNo,3);
                for (let i = min; i >= 0; i--) {
                    newlastThreeOvers.push(json.matchData.overNo - i + 1);
                }
                setOverArr(newlastThreeOvers);
            

        } else {
            localStorage.removeItem('matchId');
        }

    }

    useEffect(()=>{
        let token = localStorage.getItem('token');

        if(!token){
            navigate('/adminlogin');
        }
    },[])

    useEffect(() => {


      
        
        socket.on('connect', () => {
            let matchId = localStorage.getItem('matchId');
            if (matchId) {
                getMatchDataFromDB();
            }else{
            socket.emit('getmatchIdFromServe');
            }
            
        });

        socket.on('sendingId',(data)=>{
            localStorage.setItem('matchId', data);
            getMatchDataFromDB();
        })

        socket.on('matchId', (data) => {
            localStorage.setItem('matchId', data); 
        });
    

    }, [])

    return (
        <div className="container mx-auto px-4 sm:w-[100%] md:w-[90%] sm:mx-auto md:mx-auto 350:w-[110%] 320:w-[118%] 300:w-[120%] 300:-ml-5 375:w-[110%] 390:w-[110%] 425:mx-auto 500:w-[100%] 425:w-[100%] 585:w-[102%] h-fit border border-black">
            <Header currentBall={currentBall} runs={runs} wickets={wickets} overNo={overNo} setOverNo={setOverNo} />

            <AdminControl setCurrentBall={setCurrentBall} overValue={overValue} setOverValue={setOverValue} overNo={overNo} setOverNo={setOverNo} wickets={wickets} runs={runs} setRuns={setRuns} setWickets={setWickets} lastThreeOvers={lastThreeOvers} setLastThreeOvers={setLastThreeOvers} currentBall={currentBall} setOverArr={setOverArr} overArr={overArr} setMoveValue={setMoveValue} moveValue={moveValue} />


            <OverList overValue={overValue} lastThreeOvers={lastThreeOvers} currentBall={currentBall} overArr={overArr} overNo={overNo} />
            
            <div className="flex justify-between w-1/2 300:w-[100%] sm:w-[40%] md:w-[30%] lg:w-[30%] mx-auto mt-6 mb-4">
        <button
          onClick={handleNewMatch}
          className="px-4 py-2 bg-blue-500 text-white rounded w-fit 300:text-xs sm:text-sm lg:text-lg  hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          New Match
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded w-fit 300:text-xs sm:text-sm  lg:text-lg  hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
        >
          Logout
        </button>
      </div>
        </div>
    )
}

export default AdminView