/*
 * Author: Shivam Singhal
 * Description: Kmeans Utility 
 * Date: July 7, 2021
 */

const kmeans = require('node-kmeans')

const MAX_VECTORS_IN_CLUSTER = 5000

/*
 * Author: Shivam Singhal
 * Description: fetching user's centroid and its distance
 * Date: July 7, 2021
 */
const getUserDistanceMap = list => {
    return new Promise((resolve, reject) => {
        let vectors = [], map = {}
    
        list.forEach((ele, i) => { 
            vectors[i] = [ele.rock || 0, ele.classical || 0, ele.pop || 0, ele.rap || 0, ele.electronic || 0, ele.extra_version || 0]
        })
        console.log('vectors from list created:: ', vectors.length)

        let k = Math.ceil(list.length / MAX_VECTORS_IN_CLUSTER)
        console.log('K Clusters:: ', k)
        let Clusterize = kmeans.clusterize(vectors, {k}, (err, clusters) => {
            clusters.forEach((cluster, clusterId) => {
                console.log('Cluster::',clusterId, ' Users in cluster', cluster.clusterInd.length)
                cluster.clusterInd.forEach((idx, i) => {
                    map[clusterId] = map[clusterId] || {}
                    map[clusterId][list[idx].user_id] = {
                        //distance
                        distance: Clusterize.distanceFunction(cluster.centroid, cluster.cluster[i]),
                        clusterId,
                        //all elements of list user, genremembership, extraversion
                        ...list[idx]
                    }
                })
            })
            resolve(map)
        })  
    })
}

module.exports = {
    getUserDistanceMap
}