export const getEndpointKeys = async(qnaMakerClient) => {
    try {
        console.log(`Getting runtime endpoint keys...`)

        const runtimeKeysClient = await qnaMakerClient.endpointKeys;
        const results = await runtimeKeysClient.getKeys()
        console.log(runtimeKeysClient, results)

        if (!results._response.status.toString().startsWith("2")) {
            console.log(`GetEndpointKeys request failed - HTTP status ${results._response.status}`)
            return null
        }

        console.log(`GetEndpointKeys request succeeded - HTTP status ${results._response.status} - primary key ${results.primaryEndpointKey}`)

        return results.primaryEndpointKey

    } catch (error) {
        console.log(error)
        return null

    }


}