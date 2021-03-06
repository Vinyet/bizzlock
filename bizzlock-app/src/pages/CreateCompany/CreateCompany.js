import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHistory, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import { postCompany, createUser, getUsers, updateUser } from '../../services/data';
import { getPerkIndex, allPerks } from '../../logic/jobperks';
import CommentCreator from '../../components/Comments/CommentCreator';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';


const industries = [
    { title: 'Arts and graphic design' },
    { title: 'Business Administration' },
    { title: 'Construction' },
    { title: 'Education' },
    { title: 'Fashion' },
    { title: 'Finances' },
    { title: 'Health' },
    { title: 'Human Resources' },
    { title: 'IT' },
    { title: 'Marketing and Communication' },
    { title: 'Retail' },
    { title: 'Sales' },
    { title: 'Science and Engineering' },
    { title: 'Tourism and Hospitality' },
    { title: 'Others' }
]
const cities = [
    { title: 'Álava' },
    { title: 'Albacete' },
    { title: 'Alicante' },
    { title: 'Almería' },
    { title: 'Asturias' },
    { title: 'Ávila' },
    { title: 'Badajoz' },
    { title: 'Baleares' },
    { title: 'Barcelona' },
    { title: 'Burgos' },
    { title: 'Cáceres' },
    { title: 'Cádiz' },
    { title: 'Cantabria' },
    { title: 'Castellón' },
    { title: 'Ciudad Real' },
    { title: 'Córdoba' },
    { title: 'La Coruña' },
    { title: 'Cuenca' },
    { title: 'Gerona' },
    { title: 'Granada' },
    { title: 'Guadalajara' },
    { title: 'Guipúzcoa' },
    { title: 'Huelva' },
    { title: 'Jaén' },
    { title: 'León' },
    { title: 'Lérida' },
    { title: 'Lugo' },
    { title: 'Madrid' },
    { title: 'Málaga' },
    { title: 'Murcia' },
    { title: 'Navarra' },
    { title: 'Orense' },
    { title: 'Palencia' },
    { title: 'Las Palmas' },
    { title: 'Pontevedra' },
    { title: 'La Rioja' },
    { title: 'Salamanca' },
    { title: 'Segovia' },
    { title: 'Sevilla' },
    { title: 'Soria' },
    { title: 'Tarragona' },
    { title: 'Santa Cruz de Tenerife' },
    { title: 'Teruel' },
    { title: 'Toledo' },
    { title: 'Valencia' },
    { title: 'Valladolid' },
    { title: 'Vizcaya' },
    { title: 'Zamora' },
    { title: 'Zaragoza' },
]

const CreateCompany = props => {
    const fadeIn = useSpring({opacity: 1, from: {opacity: 0}});
    const history = useHistory();
    const loc = useLocation();
    const [ newCompanyName, setNewCompanyName ] = useState('');
    const [ googleCompany, setGoogleCompany ] = useState();
    const [ industry, setIndustry ] = useState('');
    const [ location, setCity ] = useState('');
    const [ website, setWebsite ] = useState('');
    const [ perks, setPerks ] = useState([]);
    const [ workLife, setWorkLife ] = useState(undefined);
    const [ salary, setSalary ] = useState(undefined);
    const [ overallRating, setOverallRating ] = useState(undefined);
    const [ comment, setComment ] = useState('');
    const [ image, setImage ] = useState('');
    const [ successMessage, setSuccessMessage ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);
    const [ checked, setChecked ] = useState(false);
    const [ firebaseUserData, setFirebaseUserData ] = useState([]);

    useEffect(() => {
        parse();
    }, [])
    
    useEffect(() => {
        const getFirebaseUser = async () => {
            const getFirebaseUserData = await getUsers();
            setFirebaseUserData(getFirebaseUserData);
        }
        getFirebaseUser();
    }, [])

    const parse = () => {
        if (typeof(loc.state) === 'string') {
            const getNewCompany = loc.state;
            setNewCompanyName(getNewCompany);
        } else if (typeof(loc.state) === 'object') {
            const getGoogleCompany = loc.state;
            setNewCompanyName(getGoogleCompany.name);
            setGoogleCompany(getGoogleCompany);
            if (getGoogleCompany.image) { setImage(getGoogleCompany.image.contentURL)}
        }
    }

    const handleJobPerks = (e) => {
        const perkName = e.target.name;
        const perkLabel = e.target.value;
        getPerkIndex(perkName);
        setPerks([...perks, { perkId: perkName, label: perkLabel }])
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!googleCompany && !checked) {
            setErrorMessage(true);
            setSuccessMessage(false);
        }
        else if (!googleCompany) {
            const form = {
                name: newCompanyName,
                location,
                industry,
                website,
                jobPerks: perks,
                workLife,
                salary,
                overallRating,
                usersWhoRated: 1,
                comments: [comment]
            }
            const user = getCurrentUser();
            const userExists = firebaseUserData.filter((firebaseUser) => (firebaseUser.uid === user.uid))
            if (userExists.length) {
                const [userData] = userExists; 
                const sameUserCopy = {...userData};
                sameUserCopy.ratedCompanies.push(newCompanyName);
                postCompany(form)
                updateUser(sameUserCopy);
            } else {
                const newUser = { uid: user.uid, ratedCompanies: [newCompanyName] }
                createUser(newUser); 
                postCompany(form);
            } 
            setErrorMessage(false);
            setSuccessMessage(true)
        } else if (googleCompany) {
            const form = {
                name: googleCompany.name,
                description: googleCompany.description,
                industry,
                location,
                website,
                jobPerks: perks,
                workLife,
                salary,
                overallRating,
                usersWhoRated: 1,
                comments: [comment]
            }     
            if (googleCompany.image) { form.image = googleCompany.image.contentUrl }
            const user = getCurrentUser();
            const userExists = firebaseUserData.filter((firebaseUser) => (firebaseUser.uid === user.uid))
            if (userExists.length) {
                const [userData] = userExists; 
                const sameUserCopy = {...userData};
                sameUserCopy.ratedCompanies.push(newCompanyName);
                postCompany(form)
                updateUser(sameUserCopy);
            } else {
                const newUser = { uid: user.uid, ratedCompanies: [newCompanyName] }
                createUser(newUser); 
                postCompany(form);
            } 
            setErrorMessage(false);
            setSuccessMessage(true)
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        history.push("/sign-up");
    }

    return (
        <>
            <animated.div style={fadeIn} className='create-company-form'>
                <h2>Create registry for <span>{newCompanyName}</span></h2>
                <p className="text-above">No one in the organisation will get notified, nor will they know who added the company.</p>     
                <form onSubmit={handleFormSubmit}>   
                <hr data-content='ABOUT THIS COMPANY'/>
                    <div className="company-information">
                        {(googleCompany) ? 
                            <>
                            <div className="company-cover">
                                <div className='top-description-photo'>
                                    {(image) ? <img src={image} alt='company'/> : null}
                                    <div className="company-description">{googleCompany.description}</div>
                                </div>
                            </div>
                                <div className='top-information'>
                                    <div className='top-location'>
                                        <label>What sector does this company especialize in?</label>
                                        <Autocomplete id="free-solo-demo" freeSolo options={industries.map((option) => option.title)} onChange={(event, newValue) => {setIndustry(newValue)}} renderInput={(params) => (
                                            <TextField {...params} label="Industry" margin="normal" variant="outlined" />
                                        )}/>
                                    </div>
                                    <div className='top-industry'>
                                        <label>Which headquarters do you work at?</label>
                                        <Autocomplete id="free-solo-demo" freeSolo options={cities.map((option) => option.title)} onChange={(event, newValue) => {setCity(newValue)}} renderInput={(params) => (
                                            <TextField {...params} label="Location" margin="normal" variant="outlined" />
                                        )}/>
                                    </div>     
                                </div>
                            </>   
                        :   
                            <>
                            <div className="information-selects">
                                <div className="industry-select">
                                    <label htmlFor="industry-option">INDUSTRY</label>
                                    <Autocomplete id="free-solo-demo" freeSolo options={industries.map((option) => option.title)} onChange={(event, newValue) => {setIndustry(newValue)}} renderInput={(params) => (
                                        <TextField {...params} label="Industry" margin="normal" variant="outlined" />
                                    )}/>
                                </div>
                                <div className="location-select">    
                                    <label htmlFor="location-option">LOCATION</label>
                                    <Autocomplete id="free-solo-demo" freeSolo options={cities.map((option) => option.title)} onChange={(event, newValue) => {setCity(newValue)}} renderInput={(params) => (
                                        <TextField {...params} label="Location" margin="normal" variant="outlined" />
                                    )}/>
                                </div>
                            </div> 
                            <div className="website-box">
                                <label htmlFor="website-input">WEBSITE</label><br/>
                                <input type='text' id='website-input' name='website' onChange={(e) => setWebsite(e.target.value)}></input>
                            </div>
                            </>
                        }     
                    </div>    
                    <h5>What job perks does this company offer?</h5>
                    <div className="perks-flex" name='perks'>
                        <div>
                            <input type="checkbox" className="perks-check" name="perk1" value='Restaurant discounts' onChange={handleJobPerks}></input><p>Restaurant discounts</p><br/>
                            <input type="checkbox" className="perks-check" name="perk2" value='Gym membership' onChange={handleJobPerks}></input><p>Gym membership</p><br/>
                            <input type="checkbox" className="perks-check" name="perk3" value='Nursery' onChange={handleJobPerks}></input><p>Nursery</p><br/>
                            <input type="checkbox" className="perks-check" name="perk4" value='Birthdays off' onChange={handleJobPerks}></input><p>Birthdays off</p><br/>
                            <input type="checkbox" className="perks-check" name="perk5" value='Flexible schedule' onChange={handleJobPerks}></input><p>Flexible schedule</p><br/>
                        </div>
                        <div>
                            <input type="checkbox" className="perks-check" name="perk6" value='Free coffee' onChange={handleJobPerks}></input> <p>Free coffee</p><br/>
                            <input type="checkbox" className="perks-check" name="perk7" value='Free fruit and snacks' onChange={handleJobPerks}></input> <p>Free fruit and snacks</p><br/>
                            <input type="checkbox" className="perks-check" name="perk8" value='Relaxing employee area' onChange={handleJobPerks}></input> <p>Relaxing employee area</p><br/>
                            <input type="checkbox" className="perks-check" name="perk9" value='Good views' onChange={handleJobPerks}></input> <p>Good views</p><br/>
                            <input type="checkbox" className="perks-check" name="perk10" value='Fully equipped kitchen' onChange={handleJobPerks}></input> <p>Fully equipped kitchen</p><br/>
                        </div>
                        <div>
                            <input type="checkbox" className="perks-check" name="perk11" value='Open offices' onChange={handleJobPerks}></input> <p>Open offices</p><br/>
                            <input type="checkbox" className="perks-check" name="perk12" value='Training' onChange={handleJobPerks}></input> <p>Training</p><br/>
                            <input type="checkbox" className="perks-check" name="perk13" value='Health insurance' onChange={handleJobPerks}></input> <p>Health insurance</p><br/>
                            <input type="checkbox" className="perks-check" name="perk14" value='Free parking' onChange={handleJobPerks}></input> <p>Free parking</p><br/>
                            <input type="checkbox" className="perks-check" name="perk15" value='Employee bonus plan' onChange={handleJobPerks}></input> <p>Employee bonus plan</p><br/>
                        </div>
                    </div>
                    <hr data-content='YOUR FEEDBACK'/>
                    <div className="company-feedback">   
                            <h5>Rate the following aspects:</h5>
                            <div className="star-rating-container">
                                <label htmlFor='star-rating' className='star-label'>How is the work/life balance?</label>
                                <div className="star-rating">
                                    <Box component="fieldset" mb={3} borderColor="transparent">
                                        <Rating name="worklife" onChange={(event, newValue) => {setWorkLife(newValue)}} />
                                    </Box>      
                                </div>
                            </div>
                            <div className="star-rating-container">
                                <label htmlFor='star-rating' className='star-label'>How well does this company pay?</label>
                                <div className="star-rating">
                                    <Box component="fieldset" mb={3} borderColor="transparent">
                                        <Rating name="salary" onChange={(event, newValue) => {setSalary(newValue)}} />
                                    </Box>
                                </div>
                            </div>
                            <div className="star-rating-container"> 
                                <label htmlFor='star-rating' className='star-label'>How would you rate your stay at this company?</label>
                                <div className="star-rating">    
                                    <Box component="fieldset" mb={3} borderColor="transparent">
                                        <Rating name="overallRating" onChange={(event, newValue) => {setOverallRating(newValue); }}/>
                                    </Box>
                                </div>    
                            </div>
                    </div>
                    <label htmlFor="comment" className="comments-label">Comment (optional)</label>
                    <div className="comments-area">
                        <CommentCreator setComment={setComment} />
                    </div>
                    <div className="submit-btns">
                        {(googleCompany) ? null : 
                            <div className='privacy-check'>
                            <input type="checkbox" id="check-privacy" onChange={(e)=> setChecked(!checked)}></input>
                            <label htmlFor="true">I accept Bizzlock&apos;s <a href="/privacy-policy" id="privacy-link">Privacy Policy</a>.</label>
                            </div> 
                        } 
                        {(errorMessage) ? <Alert variant="outlined" severity="error">Please, accept the Privacy Policy to proceed.</Alert> : null}
                        <input type="submit" id="create-btn" value="SUBMIT"></input>
                        <button onClick={handleCancel}>CANCEL</button>
                        {(successMessage) ? <Alert variant="outlined" severity="success">Great! Your registry will be up soon. <a href="/">Back to homepage.</a></Alert>  : null}
                    </div>
                </form>
            </animated.div>
        </>    
    )
}

export default CreateCompany;