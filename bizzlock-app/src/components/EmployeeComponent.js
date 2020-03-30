import React from 'react';
import { useHistory } from 'react-router-dom';


const EmployeeComponent = () => {
    const history = useHistory();

    function handleClick() {
        history.push("/sign-up");
    }

    return (
        <>
        <div className="employee-container">
            <img src='https://image.flaticon.com/icons/svg/1584/1584911.svg' alt="employee-icon"/>
            <p>Do you work for a company?</p>
            <button onClick={handleClick}>GIVE FEEDBACK</button>
        </div>    
        </>
    )
}

export default EmployeeComponent;