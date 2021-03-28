const axios = require('axios')

var tournamentsUrl = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/1/17'
// var matchUrl = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/%7b_tid%7d/2021' 
var matchUrl = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/29/2021'


//Tournaments API call
async function tournaments() {
    //todo try catch
    let response = await axios.get(tournamentsUrl)

    let events = response.data.doc[0].data

    return {
        torunaments: filterTorunaments(events),
        uniqueTorunaments: filterUniqueTournaments(events),
        cupTrees: filterCupTrees(events)
    }
}

//Matches for tournament API call
async function matches() {
    //todo try catch
    let response = await axios.get(matchUrl)

    let total = response.data.doc[0].data.matches

    //Sorting
    let ordered = Object.keys(total).sort((a, b) => total[a].time.uts > total[b].time.uts).reduce(
        (obj, key) => {
            obj[key] = total[key]
            return obj
        },
        {}
    )

    //First 5 matches
    let sliced = Object.entries(ordered).slice(0, 5)

    return {
        matches: filterMatches(sliced)
    }
}

//Tournaments data filtering
const filterTorunaments = function (events) {
    let result = []

    events.tournaments.forEach(element => {
        let { _id: id, name, abbr, year, seasontypename } = element
        result.push({ id, name, abbr, year, seasontypename })
    })

    return result
}

//Uniquetournaments data filtering
const filterUniqueTournaments = function (events) {
    let result = []

    for (let key in events.uniquetournaments) {
        let { _id: id, name } = events.uniquetournaments[key]
        result.push({ id, name })
    }

    return result
}

//Cuptrees data filtering
const filterCupTrees = function (events) {
    let result = []

    for (let key in events.cuptrees) {
        events.cuptrees[key].forEach(element => {
            let { _id: id, name } = element
            result.push({ id, name })
        })
    }

    return result
}

//Matches data filtering
const filterMatches = function (matches) {
    var result = []

    for (let key in matches) {
        let {
            _id: id,
            time: { date },
            time: { time },
            teams: { home: { name: home_team } },
            teams: { away: { name: away_team } },
            result: { home: home_score },
            result: { away: away_score },
            comment
        } = matches[key][1]
        result.push({ id, date, time, home_team, away_team, home_score, away_score, comment })
    }

    return result
}

module.exports = { tournaments, matches }