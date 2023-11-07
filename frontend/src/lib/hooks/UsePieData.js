const usePieData = (statisticData) => {
    const result = []
    result.push({
        id: "Remains",
        label: "Disk Space Remains",
        value: statisticData.disk_usage_limit - statisticData.disk_loaded,
        color: "hsl(113, 100%, 32%)"
    })
    result.push({
        id: "Loaded",
        label: "Disk Loaded",
        value: statisticData.disk_loaded,
        color: "hsl(130, 70%, 50%)"
    })

    return result
}

export default usePieData;