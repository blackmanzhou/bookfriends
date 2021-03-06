const validator = require('validator')
const logUtil = require('../../utils/logUtil')
const errorMsg = require('../../error/errorMsg')
const errorCode = require('../../error/errorCode')
const userManager = require('../../managers/admin/user')
const dynamicManager = require('../../managers/userDynamicManager')

/**
 * Querys all books.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function queryAll (req, res, next) {
  const functionName = 'server: controllers/admin/user/queryAll'
  // logs request info.
  logUtil.logDebugMsg(functionName, JSON.stringify(req.query))
  let responseResult = { errorCode: errorCode.SUCCESS }

  let pageIndex = req.query.pageIndex
  let pageSize = req.query.pageSize

  try {
    if (!pageIndex || (pageIndex && !validator.trim(pageIndex))) {
      throw new Error('Please provide parameter: pageIndex')
    } else if (!pageSize || (pageSize && !validator.trim(pageSize))) {
      throw new Error('Please provide parameter: pageSize')
    } else {
      pageIndex = parseInt(pageIndex)
      pageSize = parseInt(pageSize)
      if (pageIndex <= 0) {
        throw new Error('Please provide valid number parameter: pageIndex > 0')
      } else if (pageSize <= 0) {
        throw new Error('Please provide valid number parameter: pageSize > 0')
      }
    }
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: error.message }
    logUtil.logErrorMsg(functionName, error.message)
    return res.status(200).send(responseResult)
  }

  try {
    responseResult = await userManager.queryAll(pageIndex, pageSize)
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_MANAGER, errorMsg: errorMsg.ERROR_CALL_MANAGER + JSON.stringify(error) }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
  }

  return res.status(200).send(responseResult)
}

/**
 * Deletes one user.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function deleteUser (req, res, next) {
  const functionName = 'server: controllers/admin/user/deleteUser'
  // logs request info.
  logUtil.logDebugMsg(functionName, JSON.stringify(req.body))
  let responseResult = { errorCode: errorCode.SUCCESS }

  let phoneNumber = req.body.phoneNumber
  try {
    if (!phoneNumber || (phoneNumber && !validator.trim(phoneNumber))) {
      throw new Error('Please provide parameter: userId')
    } else {
      phoneNumber = validator.trim(phoneNumber)
    }
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG + error.message }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
    return res.status(200).send(responseResult)
  }

  try {
    responseResult = await userManager.deleteUser(phoneNumber)
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_MANAGER, errorMsg: errorMsg.ERROR_CALL_MANAGER + JSON.stringify(error) }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
  }

  return res.status(200).send(responseResult)
}

/**
 * Gets the chart results.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getChartGroup (req, res, next) {
  const functionName = 'server: controllers/admin/user/getChartGroup'
  // logs request info.
  logUtil.logDebugMsg(functionName, JSON.stringify(req.query))
  let responseResult = { errorCode: errorCode.SUCCESS }

  try {
    responseResult = await userManager.getChartGroup()
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_MANAGER, errorMsg: errorMsg.ERROR_CALL_MANAGER + JSON.stringify(error) }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
  }

  return res.status(200).send(responseResult)
}

/**
 * Gets city chart when in same province.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCityChart (req, res, next) {
  const functionName = 'server: controllers/admin/user/deleteUser'
  // logs request info.
  logUtil.logDebugMsg(functionName, JSON.stringify(req.query))
  let responseResult = { errorCode: errorCode.SUCCESS }

  let provinceName = req.query.provinceName
  try {
    if (!provinceName || (provinceName && !validator.trim(provinceName))) {
      throw new Error('Please provide parameter: provinceName')
    } else {
      provinceName = validator.trim(provinceName)
    }
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG + error.message }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
    return res.status(200).send(responseResult)
  }

  try {
    responseResult = await userManager.getCityChart(provinceName)
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_MANAGER, errorMsg: errorMsg.ERROR_CALL_MANAGER + JSON.stringify(error) }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
  }

  return res.status(200).send(responseResult)
}

/**
 * Gets users is onlined.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function queryOnlineUsers (req, res, next) {
  const functionName = 'server: controllers/admin/user/queryOnlineUsers'
  // logs request info.
  logUtil.logDebugMsg(functionName, JSON.stringify(req.query))
  let responseResult = { errorCode: errorCode.SUCCESS }
  let isOnline = req.query.isOnline

  try {
    if (!isOnline || (isOnline && !validator.trim(isOnline))) {
      throw new Error('Please provide parameter: isOnline')
    } else {
      isOnline = validator.trim(isOnline)
      isOnline = parseInt(isOnline)
    }
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG + error.message }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
    return res.status(200).send(responseResult)
  }

  try {
    responseResult = await userManager.queryOnlineUsers(isOnline)
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_MANAGER, errorMsg: errorMsg.ERROR_CALL_MANAGER + JSON.stringify(error) }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
  }

  return res.status(200).send(responseResult)
}

/**
 * Querys today's dynamics.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function queryTodayDynamics (req, res, next) {
  const functionName = 'server: controllers/admin/user/queryTodayDynamics'
  // logs request info.
  logUtil.logDebugMsg(functionName, JSON.stringify(req.query))
  let responseResult = { errorCode: errorCode.SUCCESS }

  try {
    responseResult = await dynamicManager.queryTodayDynamics()
  } catch (error) {
    responseResult = { errorCode: errorCode.ERROR_MANAGER, errorMsg: errorMsg.ERROR_CALL_MANAGER + JSON.stringify(error) }
    logUtil.logErrorMsg(functionName, responseResult.errorMsg)
  }

  return res.status(200).send(responseResult)
}

exports.queryAll = queryAll
exports.delete = deleteUser
exports.getCityChart = getCityChart
exports.getChartGroup = getChartGroup
exports.queryOnlineUsers = queryOnlineUsers
exports.queryTodayDynamics = queryTodayDynamics
