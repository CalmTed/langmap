
import './App.css'
import { PAGE } from './constants'
import { useEffect, useState } from 'react'
import { FinishingPage } from './components/Finishing'
import { HomePage } from './components/Home'
import { ResultsPage } from './components/Results'
import { TestPage } from './components/Test'

function App() {
  // const state = useAppSelector(selectState)
  // const dispatch = useAppDispatch()
  const [path, setPath] = useState(window.location.hash || PAGE.HOME)

  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash)
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      {
        path == PAGE.HOME && <HomePage/>
      }
      {
        path == PAGE.TEST && <TestPage/>
      }
      {
        path == PAGE.FINISHING && <FinishingPage/>
      }
      {
        path == PAGE.RESULT && <ResultsPage/>
      }
      {/* <h1>{state.interfaceLang}</h1>
      <div className="card">
        <button onClick={() => dispatch(setInterfaceLang(INTERFACE_LANG.EN))}>{INTERFACE_LANG.EN}</button>
        <button onClick={() => dispatch(setInterfaceLang(INTERFACE_LANG.UA))}>{INTERFACE_LANG.UA}</button>
      </div> */}
    </>
  )
}

export default App
