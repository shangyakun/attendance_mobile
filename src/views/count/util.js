
/*
**  过滤签入状态
*/
function formatCheckinStatus(val) {
    if(val == undefined) {
        return ''
    }else if(val == 1) {
        return '正常'
    }else if(val == 2) {
        return '迟到'
    }else if(val == 3) {
        return '缺进'
    }
}
/*
**  过滤签出状态
*/
function formatCheckoutStatus(val) {
    if(val == undefined) {
        return ''
    }else if(val == 1) {
        return '正常'
    }else if(val == 2) {
        return '早退'
    }else if(val == 3) {
        return '缺退'
    }
}

function formatBusinessTrip(val) {
  if (val == undefined) {
    return ''
  } else if (val == 2) {
    return '出差'
  } else if (val == 3) {
    return '公出'
  }
}
export default{
    formatCheckinStatus,
    formatCheckoutStatus,
    formatBusinessTrip
}