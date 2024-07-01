// fetch the data with the requested lang
const getData = async (list, lang) => {
    const elementPromise = []
    const objectPromise = []
    // console.log(typeof list === 'object')
    if (typeof list === 'object'&& list.length ===undefined) {
        const tempData = {}
        for (var obj in list._doc) {
            objectPromise.push(new Promise(async (resolve, reject) => {
                if (Array.isArray(list[obj])) {
                    const tempObj = list[obj].map(x => x[lang])
                    tempData[obj] = tempObj
                    resolve({ [obj]: tempData[obj] })
                }
                else {
                    if (typeof list[obj] === 'object' && list[obj] !== null) {
                        const tempObj = list[obj][lang] !== undefined ? list[obj][lang] : list[obj]
                        tempData[obj] = tempObj
                        resolve({ [obj]: tempData[obj] })
                    }
                    else {
                        const tempObj = list[obj]
                        tempData[obj] = tempObj
                        resolve({ [obj]: tempData[obj] })
                    }
                }
            }))
        }
        const langObjects = await Promise.all(objectPromise)
        const langData = langObjects.reduce(((r, c) => Object.assign(r, c)), {});
        return langData
    }
    else {
        list.forEach(async element => {
            elementPromise.push(new Promise(async (resolve, reject) => {
                const tempData = {}
                for (var obj in element._doc) {
                    objectPromise.push(new Promise(async (resolve, reject) => {
                        if (Array.isArray(element[obj])) {
                            const tempObj = element[obj].map(x => x[lang])
                            tempData[obj] = tempObj
                            resolve({ [obj]: tempData[obj] })
                        }
                        else {
                            if (typeof element[obj] === 'object' && element[obj] !== null) {
                                const tempObj = element[obj][lang] !== undefined ? element[obj][lang] : element[obj]
                                tempData[obj] = tempObj
                                resolve({ [obj]: tempData[obj] })
                            }
                            else {
                                const tempObj = element[obj]
                                tempData[obj] = tempObj
                                resolve({ [obj]: tempData[obj] })
                            }
                        }
                    }))
                }
                const langObjects = await Promise.all(objectPromise)
                const langData = langObjects.reduce(((r, c) => Object.assign(r, c)), {});
                resolve(langData)
            }))
        })
    }
    return Promise.all(elementPromise)
}
module.exports = getData