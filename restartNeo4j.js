const restartNeo4j = () => {
    return new Promise((res, rej) => {
        require('child_process').execSync(`echo "${process.env.ROOT_PASS}" | sudo -S systemctl restart neo4j`)

        setTimeout(res, 10000);
    })

}

module.exports = restartNeo4j;