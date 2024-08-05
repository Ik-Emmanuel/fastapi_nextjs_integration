"use client";
import Image from "next/image";
import ProtectedRoutes from "./components/ProtectedRoutes";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import AuthContext from "./context/AuthContext";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState<
    number[] | string[] | null
  >([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're running in the browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchWorkoutsAndRoutines = async () => {
      try {
        const [workoutsResponse, routinesResponse] = await Promise.all([
          axios.get("http://localhost:8000/workouts/workouts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8000/routines", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setWorkouts(workoutsResponse.data);
        setRoutines(routinesResponse.data);
      } catch (error) {
        console.log(error);
        setError(JSON.stringify(error));
      }
    };

    if (token) {
      fetchWorkoutsAndRoutines();
    }
  }, [token, user]);

  const handleCreateWorkout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/workouts",
        {
          name: workoutName,
          description: workoutDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkouts([...workouts, response.data]);
      setWorkoutName("");
      setWorkoutDescription("");
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
    }
  };

  const handleCreateRoutine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/routines",
        {
          name: routineName,
          description: routineDescription,
          workouts: selectedWorkouts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoutineName("");
      setRoutines([...routines, response.data]);
      setRoutineDescription("");
      setSelectedWorkouts([]);
    } catch (error) {
      console.log(error);
      setError(JSON.stringify(error));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setSelectedWorkouts(selectedOptions);
  };

  return (
    <ProtectedRoutes>
      <main>
        <div className="flex justify-center items-center h-full mx-auto mt-10 w-[80%]">
          <div className="flex justify-between items-center w-full px-10">
            <p className="text-cyan-500 font-semibold">Hello, User</p>
            <button
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="w-full mt-10 px-[100px] mb-8">
          <h1 className="text-3xl font-bold">Available Workouts</h1>
          <p className="text-gray-500">Your listed workouts</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 ">
            {workouts.map((workout: any) => (
              <div
                key={workout.id}
                className="w-full  bg-slate-900  rounded-lg p-4"
              >
                <h1 className="text-lg font-bold">{workout.name}</h1>
                <p className="text-gray-500 text-[12px]">
                  {workout.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-10 px-[100px] mb-8">
          <h1 className="text-3xl font-bold">Your Routines</h1>
          <p className="text-gray-500">Your set workout routines</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 ">
            {routines.map((routine: any) => (
              <div
                key={routine.id}
                className="w-full mt-2 bg-slate-900  rounded-lg p-4"
              >
                <h1 className="text-lg font-bold">{routine.name}</h1>
                <p className="text-gray-500 text-[12px]">
                  {routine.description}
                </p>
                <p className="text-cyan-500 text-[12px]">
                  {routine.workouts.length} Workouts
                </p>
                <div className="mt-4">
                  {routine.workouts.map((workout: any) => (
                    <p
                      key={workout.id}
                      className="text-gray-500 text-[14px] px-2"
                    >
                      <span className="text-cyan-500 text-xl">•</span>{" "}
                      {workout.name}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mt-10 mb-10">
          <div className="w-full mt-10 px-[100px]">
            <h1 className="text-3xl font-bold">Create Workouts</h1>
            <p className="text-gray-500">Create your workouts below</p>
            <form onSubmit={handleCreateWorkout} className="w-full">
              <div className="mb-4 mt-6">
                <label
                  htmlFor="workoutName"
                  className="block text-sm font-medium text-cyan-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="workoutName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="workoutDescription"
                  className="block text-sm font-medium text-cyan-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="workoutDescription"
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Create Workout
              </button>
            </form>
          </div>
          <div className="w-full mt-10 px-[100px]">
            <h1 className="text-3xl font-bold">Add Routines</h1>
            <p className="text-gray-500">
              create your own routines and track your progress
            </p>
            <form onSubmit={handleCreateRoutine}>
              <div className="mb-4 mt-6">
                <label
                  htmlFor="workoutName"
                  className="block text-sm font-medium text-cyan-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="routineName"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="workoutDescription"
                  className="block text-sm font-medium text-cyan-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="routineDescription"
                  value={routineDescription}
                  onChange={(e) => setRoutineDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="mb-4 mt-6">
                  <label
                    htmlFor="workouts"
                    className="block text-sm font-medium text-cyan-700"
                  >
                    Select Workouts
                  </label>
                  <select
                    multiple
                    className="mt-1 block w-full px-3 py-2 bg-white text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    onChange={handleSelectChange}
                    name="workouts"
                    id="workouts"
                  >
                    {workouts.map((workout: any) => (
                      <option key={workout.id} value={workout.id}>
                        {workout.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Create Routine
              </button>
            </form>
          </div>
        </div>
      </main>
    </ProtectedRoutes>
  );
}
