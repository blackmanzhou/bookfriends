const tools = require('../utils/tools')
const logUtil = require('../utils/logUtil')
const errorMsg = require('../error/errorMsg')
const UserInfo = require('../models').UserInfo
const errorCode = require('../error/errorCode')
const PAGE_SIZE = require('../config/systemConfig').pageSize

/**
 * Registers a new account.
 * @param {String} phoneNumber
 * @param {String} password
 */
async function register (phoneNumber, password, nickName) {
  let result = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG }

  if (phoneNumber && password && nickName) {
    // Finds the user by phoneNumber.
    const user = await UserInfo.findOne({ phoneNumber: phoneNumber })
    // If has not existed.
    if (!user || (user && user.length === 0)) {
      const userInfo = new UserInfo({
        phoneNumber: phoneNumber,
        password: password,
        nickName: nickName
      })
      userInfo.id = userInfo.id + tools.decrypt(phoneNumber)
      // creates one account.
      await userInfo.save()
      result = { errorCode: errorCode.SUCCESS }
    } else {
      // If has existed.
      result = { errorCode: errorCode.ERROR_USER_HASEXISTED, errorMsg: errorMsg.USER_HASEXISTED }
      // resets the isActive to 'true'
      await UserInfo.update({phoneNumber: phoneNumber}, {isActive: true})
    }
  }

  return result
}

/**
 * Login.
 * @param {String} phoneNumber
 * @param {String} password
 */
async function login (phoneNumber, password) {
  let result = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG }

  // If the parameters is valid.
  if (phoneNumber && password) {
    const user = await UserInfo.findOne({ phoneNumber: phoneNumber, password: password, isActive: true }, '-__v -password')
    const account = await UserInfo.findOne({phoneNumber: phoneNumber})
    const pwd = await UserInfo.findOne({phoneNumber: phoneNumber, password: password})
    // If success, return the user's information
    if (user) {
      result = { errorCode: errorCode.SUCCESS, data: user } // login successfully.
      // async update the user's lastLoginTime.
      await UserInfo.update({phoneNumber: user.phoneNumber}, {lastLoginTime: tools.getCurrentTime(), isOnline: true})
    } else {
      if (!account) {
        result = { errorCode: errorCode.ERROR_USER_NOTEXISTED } // account is not existed.
      } else {
        if (pwd) {
          result = { errorCode: errorCode.ERROR_ACCOUNT } // account is not active. - 黑名单
        } else {
          result = { errorCode: errorCode.ERROR_PWD } // password is wrong.
        }
      }
    }
  }

  return result
}

/**
 * User exits current system.
 * @param {String} userId
 */
async function offLine (userId) {
  let result = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG }

  // If the parameters is valid.
  let user = null
  if (userId) {
    user = await UserInfo.findOne({ id: userId, isActive: true })

    // If success, return the user's information
    if (user) {
      await UserInfo.updateOne({id: userId}, {isOnline: false})
      result = { errorCode: errorCode.SUCCESS }
    } else {
      result = { errorCode: errorCode.ERROR_USER_NOTEXISTED, errorMsg: errorMsg.ERROR_USER_NOTEXISTED }
      logUtil.logInfoMsg('server: dal/user/update', 'the user is not exited')
    }
  }

  return result
}

/**
 * Updates user's personnal information.
 * @param {Object} userInfo
 */
async function updateInfo (userInfo) {
  let result = { errorCode: errorCode.ERROR_PARAMETER, errorMsg: errorMsg.PARAMETER_ERRORMSG }

  // If the parameters is valid.
  let user = null
  if (userInfo) {
    if (userInfo.userId) {
      user = await UserInfo.findOne({ id: userInfo.userId, isActive: true })
    } else {
      user = await UserInfo.findOne({ phoneNumber: userInfo.phoneNumber, isActive: true })
    }

    // If success, return the user's information
    if (user) {
      if (userInfo.userId) {
        await UserInfo.updateOne({id: userInfo.userId}, userInfo)
      } else if (userInfo.phoneNumber) {
        await UserInfo.updateOne({phoneNumber: userInfo.phoneNumber}, userInfo)
      } else {
        // Nothing to do.
      }

      result = { errorCode: errorCode.SUCCESS }
    } else {
      result = { errorCode: errorCode.ERROR_USER_NOTEXISTED, errorMsg: errorMsg.ERROR_USER_NOTEXISTED }
      logUtil.logInfoMsg('server: dal/user/update', 'the user is not exited')
    }
  }

  return result
}

/**
 * Querys user info according to user ID.
 * @param {String} userId
 */
async function queryUserInfoById (userId) {
  let data = null

  if (userId) {
    data = await UserInfo.findOne({ id: userId, isActive: true }, '-_id -__v -createTime -updateTime -password')
  }

  return data
}

/**
 * Querys user's ceratin fields by userId.
 * @param {String} userId
 */
async function queryUserCertainFieldsById (userId) {
  let data = null

  if (userId) {
    data = await UserInfo.findOne({ id: userId, isActive: true }, '-_id id headIcon nickName description')
  }

  return data
}

/**
 * Searched users by keyword.
 * @param {String} keyWord
 * @param {Number} pageIndex
 */
async function searchUsersByKeyword (keyWord, pageIndex) {
  let users = null

  if (keyWord && pageIndex > 0) {
    const regEx = new RegExp(keyWord, 'i')
    const skipCount = (pageIndex - 1) * PAGE_SIZE
    users = await UserInfo.find({$or: [{nickName: regEx}, {phoneNumber: regEx}], isActive: true}, '-_id -__v -password')
      .skip(skipCount).limit(PAGE_SIZE)
  }

  return users
}

/**
 * Querys all uers.
 */
async function queryAll (pageIndex, pageSize) {
  let users = []

  if (pageIndex > 0) {
    if (!pageSize) {
      pageSize = PAGE_SIZE
    }
    const skipCount = (pageIndex - 1) * pageSize
    users = await UserInfo.find({}).skip(skipCount).limit(pageSize)
  }
  return users
}

async function queryTotalCount () {
  let count = 0

  count = await UserInfo.find({}).count()

  return count
}

/**
 * Deletes one user by id.
 * @param {String} userId
 */
async function deleteOne (phoneNumber) {
  let result = null

  if (phoneNumber) {
    const find = await UserInfo.findOne({phoneNumber: phoneNumber, isActive: true})

    if (!find) {
      result = { errorCode: errorCode.ERROR_USER_NOTEXISTED, errorMsg: errorMsg.USER_NOTEXISTED }
    } else {
      const data = await UserInfo.deleteOne({phoneNumber: phoneNumber})
      if (data) {
        result = { errorCode: errorCode.SUCCESS }
      }
    }
  }

  return result
}

/**
 * Gets the users is onlined.
 */
async function queryOnlineUsers (isOnline) {
  let users = null
  if (isOnline === 1) {
    users = await UserInfo.find({isOnline: true})
  } else {
    users = await UserInfo.find({isOnline: false})
  }

  return users
}
// #region User Group Statistics.
async function groupBySex () {
  const data = await UserInfo.aggregate([ {$group: {'_id': {'sex': '$sex'}, 'number': {$sum: 1}}}, { $project: { '_id': 0, 'sex': '$_id.sex', 'number': 1 } } ])
  return data
}

async function groupByProvince () {
  const data = await UserInfo.aggregate([ {$group: {'_id': {'province': '$provinceName'}, 'number': {$sum: 1}}}, { $project: { '_id': 0, 'province': '$_id.province', 'number': 1 } } ])
  return data
}

async function groupByCityInCertainProvince (province) {
  const data = await UserInfo.aggregate([
    {$match: {provinceName: province}},
    {$group: {'_id': {'city': '$cityName'}, 'number': {$sum: 1}}},
    {$project: {'_id': 0, 'city': '$_id.city', 'number': 1}}
  ])
  return data
}

async function groupByEducation () {
  const data = await UserInfo.aggregate([ {$group: {'_id': {'education': '$educationBackground'}, 'number': {$sum: 1}}}, { $project: { '_id': 0, 'education': '$_id.education', 'number': 1 } } ])
  return data
}

async function groupByAge () {
  let data = []
  const currentDate = new Date(tools.getCurrentDate())
  let month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1
  let begin20 = currentDate.getFullYear() - 19 + '-' + month + '-' + currentDate.getDate()
  let begin40 = currentDate.getFullYear() - 39 + '-' + month + '-' + currentDate.getDate()
  let begin60 = currentDate.getFullYear() - 59 + '-' + month + '-' + currentDate.getDate()
  const data20 = await UserInfo.find({birthday: { $gte: begin20, $lte: currentDate }})
  const data40 = await UserInfo.find({birthday: { $gte: begin40, $lte: begin20 }})
  const data60 = await UserInfo.find({birthday: { $gte: begin60, $lte: begin40 }})
  const dataGt60 = await UserInfo.find({birthday: { $lte: begin60 }})

  if (data20 && data20.length > 0) {
    data.push(
      {
        age: '1 ~ 20',
        number: data20.length
      }
    )
  }

  if (data40 && data40.length > 0) {
    data.push(
      {
        age: '21 ~ 40',
        number: data40.length
      }
    )
  }

  if (data60 && data60.length > 0) {
    data.push(
      {
        age: '41 ~ 60',
        number: data60.length
      }
    )
  }

  if (dataGt60 && dataGt60.length > 0) {
    data.push(
      {
        age: '60 ~ ',
        number: dataGt60.length
      }
    )
  }
  return data
}

async function groupByEducationOfIds (userIds) {
  const data = await UserInfo.aggregate([
    {$match: {'id': {'$in': userIds}}},
    {$group: {'_id': {'education': '$educationBackground'}, 'number': {$sum: 1}}},
    {$project: { '_id': 0, 'education': '$_id.education', 'number': 1 }}])
  return data
}

async function groupByAgeOfIds (userIds) {
  let data = null
  const currentDate = new Date(tools.getCurrentDate())
  let month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1
  let begin20 = currentDate.getFullYear() - 19 + '-' + month + '-' + currentDate.getDate()
  let begin40 = currentDate.getFullYear() - 39 + '-' + month + '-' + currentDate.getDate()
  let begin60 = currentDate.getFullYear() - 59 + '-' + month + '-' + currentDate.getDate()
  const data20 = await UserInfo.find({id: {'$in': userIds}, birthday: { $gte: begin20, $lte: currentDate }})
  const data40 = await UserInfo.find({id: {'$in': userIds}, birthday: { $gte: begin40, $lte: begin20 }})
  const data60 = await UserInfo.find({id: {'$in': userIds}, birthday: { $gte: begin60, $lte: begin40 }})
  const dataGt60 = await UserInfo.find({id: {'$in': userIds}, birthday: { $lte: begin60 }})
  data = {
    '1 ~ 20': data20.length,
    '21 ~ 40': data40.length,
    '41 ~ 60': data60.length,
    '60 ~ ': dataGt60.length
  }
  return data
}
// #endregion

exports.login = login
exports.offLine = offLine
exports.register = register
exports.queryAll = queryAll
exports.deleteOne = deleteOne
exports.updateInfo = updateInfo
exports.queryTotalCount = queryTotalCount
exports.queryOnlineUsers = queryOnlineUsers
exports.queryUserInfoById = queryUserInfoById
exports.queryUserCertainFieldsById = queryUserCertainFieldsById
exports.searchUsersByKeyword = searchUsersByKeyword

exports.groupBySex = groupBySex
exports.groupByProvince = groupByProvince
exports.groupByCityInCertainProvince = groupByCityInCertainProvince
exports.groupByEducation = groupByEducation
exports.groupByAge = groupByAge
exports.groupByEducationOfIds = groupByEducationOfIds
exports.groupByAgeOfIds = groupByAgeOfIds
