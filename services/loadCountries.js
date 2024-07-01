const { getCountries } = require("country-state-picker")
const Country = require("../models/country")
const translate = require('translate');

const getAllCountries = async () => {
    try {
        let countries = getCountries()
        const temp = []
        countries.forEach(async element => {
            temp.push(new Promise(async (resolve, reject) => {
                const { name, code, dial_code } = element
                const arName = await translate(`${name}`, 'ar')
                const exist = await Country.findOne({ 'name.en': name })
                if (!exist) {
                    const data = new Country({ name: { en: name, ar: arName }, code, dial_code })
                    await data.save()
                    resolve()
                }
                resolve()
            }))
        })
        await Promise.all(temp)
        console.log('country loaded')
    }
    catch (error) {
        console.log(error)
    }
}
getAllCountries()