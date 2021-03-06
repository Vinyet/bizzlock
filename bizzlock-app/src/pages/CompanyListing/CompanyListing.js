import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { getCompanies } from '../../services/data';
import { getPerkIndex } from '../../logic/jobperks';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

const customIcons = {
    1: { icon: <SentimentVeryDissatisfiedIcon />, label: 'Very Dissatisfied' },
    2: { icon: <SentimentDissatisfiedIcon />, label: 'Dissatisfied' },
    3: { icon: <SentimentSatisfiedIcon />, label: 'Neutral' },
    4: { icon: <SentimentSatisfiedAltIcon />, label: 'Satisfied' },
    5: { icon: <SentimentVerySatisfiedIcon />, label: 'Very Satisfied' },
};
  
function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

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

const industries = [
    { title: 'Arts and graphic design' },
    { title: 'Business Administration' },
    { title: 'Construction' },
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

const CompanyListing = props => {
    let { location, industry } = useParams(); 
    const history = useHistory();
    const extraFadeIn = useSpring({opacity: 5, from: {opacity: 0}});
    const [ loading, setLoading ] = useState(true);
    const [ companies, setCompanies ] = useState([]);
    const [ showDetails, setShowDetails ] = useState(false);
    const [ matches, setMatches ] = useState([]);
    const [ filters, setFilters ] = useState(false);
    const [ perks, setPerks ] = useState([]);
    const [ salary, setSalary ] = useState();
    const [ rating, setRating ] = useState();
    const [ filterLocation, setFilterLocation ] = useState('');
    const [ filterIndustry, setFilterIndustry ] = useState();
    const [ searchMatches, setSearchMatches ] = useState([]);
    const [ bestRated, setBestRated ] = useState(false);
    const [ worstRated, setWorstRated ] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            const dbCompanies = await getCompanies();
            setCompanies(dbCompanies);
        }
        fetchCompanies();
        setLoading(false);
    }, []);

    useEffect(() => {
        if (industry && location && companies) {
            const searchMatches = companies.filter((company) => {
                const cityMatches = company.location.toLowerCase() === location.toLowerCase();
                return cityMatches;
            })
            searchMatches.length ? setMatches(searchMatches) : setMatches([]);
        }
    }, [companies])


    const getCompanyList = () => {
        if (filters) {
            return companies.map(company => {
                let salaryMatch = [];
                if (company.salary === salary || company.overallRating === rating || company.location === filterLocation || company.industry === filterIndustry) {
                    salaryMatch.push(company);
                    return salaryMatch.map((match) => {
                        return (
                            <animated.div style={extraFadeIn} className="results-box" key={match.id}>
                                <animated.div style={extraFadeIn} className="company-result-single">
                                    <div key={match.id} className="company-photo">
                                        {(match.image) ? <img src={`${match.image}`} alt='company'></img> : <img src="" alt="no-image"></img>}
                                    </div>    
                                    <div className="company-info">
                                        <p className="link-to-details" onClick={() => setShowDetails(match)}>{match.name}</p>                               <small>{match.industry}</small>
                                        {(match.description) ? <p>{match.description}</p> : null}
                                    </div>
                                </animated.div>
                            </animated.div>
                        )
                    })
                }
            })       
        } else if (companies && companies.length && matches && !matches.length && searchMatches && !searchMatches.length) {
            return (
                <animated.div style={extraFadeIn} className="results-box">
                    <div className="company-result-single" id="no-results-box">
                        <img src="https://image.flaticon.com/icons/svg/589/589926.svg" alt-text='no companies found'></img>
                        <p><b>No results found</b><br/>Please, use the search bar above or the filters on the left to try something else</p>
                    </div>
                </animated.div>
            )
        } else if (companies && companies.length && matches && matches.length && searchMatches && !searchMatches.length) {
            return matches.map((match) => {
                if (worstRated) {matches.sort((a, b) => parseFloat(a.overallRating) - parseFloat(b.overallRating));}
                if (bestRated) {matches.sort((a, b) => parseFloat(b.overallRating) - parseFloat(a.overallRating))} 
                return (
                    <animated.div style={extraFadeIn} className="results-box" key={match.id}>
                        <animated.div style={extraFadeIn} className="company-result-single" >
                            <div key={match.id} className="company-photo">
                                {(match.image) ? <img src={`${match.image}`} alt='company'></img> : <img src="" alt="no-image"></img>}
                            </div>    
                            <div className="company-info">
                            <p className="link-to-details" onClick={() => setShowDetails(match)}>{match.name}</p>
                                <small>{match.industry}</small>
                                {(match.description) ? <p>{match.description}</p> : null}
                            </div>
                        </animated.div>
                    </animated.div>
                )
            }) 
        } else if (companies && companies.length && searchMatches && searchMatches.length > 0) {
                return searchMatches.map((searchMatch) => {
                    return (
                        <animated.div style={extraFadeIn} className="results-box" key={searchMatch.id}>
                            <div className="company-result-single">
                                <div key={searchMatch.id} className="company-photo">
                                    {(searchMatch.image) ? <img src={`${searchMatch.image}`} alt='company'></img> : <img src="" alt="no-image"></img>}
                                </div>    
                                <div className="company-info">
                                    <p className="link-to-details" onClick={() => setShowDetails(searchMatch)}>{searchMatch.name}</p>                                    <p>{searchMatch.industry}</p>
                                    {(searchMatch.description) ? <p>{searchMatch.description}</p> : null}
                                </div>
                            </div>
                        </animated.div>
                    )
                })
        }
    }

    const handleSearch = (e) => {
        const search = e.target.value;
        if (search === "") {
            setSearchMatches({})
        } else if (search) {
            const searchResults = companies.filter((company) => {
                const match = company.name.toLowerCase().includes(search.toLowerCase());
                return match;
            })
            if (searchResults.length) { setSearchMatches(searchResults) };         
        }
    }

    const handleJobPerks = (e) => {
        const perkName = e.target.name;
        getPerkIndex(perkName); 
        setPerks([ ...perks, { perkId: perkName }])
    } 

    const handleFilters = () => { setFilters(true) }
    const turnOffFilters = () => { setFilters(false) }


    const CompanyDetails = ({ details }) => {
        console.log('details object: ', details)
        return ( 
                <>
                <h5 id="back-arrow" onClick={() => setShowDetails(false)}>⟵ GO BACK</h5>
                <animated.div style={extraFadeIn} className="company-details">
                    <div key={details.id} className='details-company-cover'>
                        <div className="company-detail-photo">
                            {(details.image) ? <img src={`${details.image}`} alt='company'></img> : null}
                        </div>    
                        <div className="company-detail-info">
                            <h2>{details.name}</h2><br/>
                            <p id='detail-sector'><strong>Sector:</strong> {details.industry}</p>
                            {(details.website) ? <a href="{details.website}">Visit website</a> : null}
                            {(details.description) ? <p id="detail-description">{details.description}</p> : null}
                        </div>    
                    </div>    
                    <h5>JOB PERKS</h5>
                    {details.jobPerks.map(perk => {
                        return (
                            <><div className='perks-check'>&#10003;</div> <p className="perks-label">{perk.label}</p></>
                        )
                    })}
                    <div className="feedback">
                        <h5>EMPLOYEE FEEDBACK</h5>
                        <p><strong>Salary rating</strong>: {((details.salary)/details.usersWhoRated).toFixed(1)}/5</p>
                        <p><strong>Work/life balance</strong>: {((details.workLife)/details.usersWhoRated).toFixed(1)}/5</p>
                        <p><strong>Employee overall rating</strong>: {((details.overallRating)/details.usersWhoRated).toFixed(1)}/5</p>
                        <br/>
                    <div className="comments-section">
                        {(details.comments) ? 
                            details.comments.map((comment) => {
                                return <>
                                    <div className="detail-comment-container">
                                        <div id="comma">&#10077;</div>
                                        <div id="comment-content">{comment}</div>
                                    </div>
                                    </>
                            })
                            :  
                            <div id="no-comments">No comments yet</div>}
                    </div>
                    </div>
            </animated.div>
            </>
        )
    }

    const handleOrder = (e) => {
        const choice = e.target.value;
        switch (choice) {
            case 'Best rated':
            setBestRated(true);
            setWorstRated(false);
            break;
            case 'Worst rated':
            setWorstRated(true);
            setBestRated(false);
            break;
        }
    }

    if (loading) return <div className="bouncing-loader"><div></div><div></div><div></div></div>

    return (
        <>
        <div className="listing-banner">
            <input type="search" autoFocus id="listing-search" onChange={handleSearch} placeholder="Search" />
            <select id='sorting-select' onChange={handleOrder}>
                <option>Most relevant</option>
                <option>Best rated</option>
                <option>Worst rated</option>
            </select>
        </div>

        <animated.div style={extraFadeIn} className="listing-container">
            <div className="listing-sidebar">

                {(filters) ? <p className="predeterminado" onClick={turnOffFilters}>Restablecer valores predeterminados</p> : null}

                <h4 style={{display: 'inline-block', marginRight: '15px'}}>Salary</h4>
                <Box component="fieldset" mb={3} borderColor="transparent">
                    <Rating name="customized-icons" getLabelText={(value) => customIcons[value].label} IconContainerComponent={IconContainer} onChange={(event, newValue) => {setSalary(newValue)}}/>
                </Box> 
                <h4>Rating</h4>
                <Box component="fieldset" mb={3} borderColor="transparent">
                    <Rating name="rating" onChange={(event, newValue) => {setRating(newValue)}} />
                </Box>  
                <h4>Change location</h4>
                <Autocomplete id="free-solo-demo" freeSolo options={cities.map((option) => option.title)} onChange={(event, newValue) => {setFilterLocation(newValue)}} renderInput={(params) => (
                    <TextField {...params} label="Location" margin="normal" variant="outlined" />
                )}/>
                <h4>Change industry</h4>
                <Autocomplete id="free-solo-demo" freeSolo options={industries.map((option) => option.title)} onChange={(event, newValue) => {setFilterIndustry(newValue)}} renderInput={(params) => (
                    <TextField {...params} label="Industry" margin="normal" variant="outlined" />
                )}/>
                <h4>Job perks</h4>
                <div className="perks-flex" name='perks'>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk1" onChange={handleJobPerks}></input><p>Restaurant discounts</p></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk2" onChange={handleJobPerks}></input><p>Gym membership</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk3" onChange={handleJobPerks}></input><p>Nursery</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk4" onChange={handleJobPerks}></input><p>Birthdays off</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk5" onChange={handleJobPerks}></input><p>Flexible schedule</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk6" onChange={handleJobPerks}></input> <p>Free coffee</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk7" onChange={handleJobPerks}></input> <p>Free fruit and snacks</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk8" onChange={handleJobPerks}></input> <p>Relaxing employee area</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk9" onChange={handleJobPerks}></input> <p>Good views</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk10" onChange={handleJobPerks}></input> <p>Fully equipped kitchen</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk11" onChange={handleJobPerks}></input> <p>Open offices</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk12" onChange={handleJobPerks}></input> <p>Training</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk13" onChange={handleJobPerks}></input> <p>Health insurance</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk14" onChange={handleJobPerks}></input> <p>Free parking</p><br/></div>
                    <div className='test'><input type="checkbox" className="perks-check" name="perk15" onChange={handleJobPerks}></input> <p>Employee bonus plan</p><br/></div>
                </div>
                <div className="btn-box">
                    <button onClick={handleFilters}>FILTER</button>
                </div>
            </div>
            <animated.div style={extraFadeIn} className="listing-results">
                {(showDetails) ? <CompanyDetails details={showDetails} /> : getCompanyList() }
            </animated.div>
        </animated.div>
        </>
    )
}
 

export default CompanyListing;