const neo4j = require('neo4j-driver')

const uri = 'bolt://localhost:7474/db/neo4j'
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'))
const session = driver.session()
const personName = 'Alice'

    (async () => {

        try {
            const result = await session.executeWrite(async tx =>{
                tx.run('CREATE (a:Person {name: $name}) RETURN a',
                { name: personName })
            })

            const singleRecord = result.records[0]
            const node = singleRecord.get(0)

            console.log(node.properties.name)
        } finally {
            await session.close()
        }

        // on application exit:
        await driver.close()
    })()
