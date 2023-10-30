const usePieData = (statisticData) => {
    const result = []
    result.push({
        id: 1,
        label: "Disk Space Remains",
        value: statisticData.disk_usage_limit - statisticData.disk_loaded,
        color: "hsl(180, 70%, 50%)"
    })
    result.push({
        id: 2,
        label: "Disk Loaded",
        value: statisticData.disk_loaded,
        color: "hsl(130, 70%, 50%)"
    })

    return result
}

export default usePieData;