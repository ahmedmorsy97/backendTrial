// import hash from 'mix-hash'
// import { compare } from 'bcryptjs'
// import { errorName } from '../constants'
// import { getErrorCode } from '../utils'
// import {
//   createOne,
//   readOne,
//   readAllOnes,
//   updateOne,
//   removeOne,
//   deleteOne
// } from '../queries'
// import { mailer, jsonwebtoken, authJWT } from '../services'
// import { User, Item } from '../models'
// import { hsetKeyValue, expireKey, hgetKeyValue } from '../../cache'

// export const sendResponse = (res, response) => {
//   res.status(200).send(response)
// }

export const sendError = (res, err) => {
  res.status(400).send({
    message: err.message ? err.message : err,
  });
};

// export const create = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const entity = await createOne(model, body)
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: `${model.modelName} have been created successfully.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: `${model.modelName} have been created successfully.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const read = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const { _id } = body
//     const entity = await readOne(model, { _id })
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: `Found ${model.modelName}.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: `Found ${model.modelName}.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const readByEmail = () => async (req, res, next) => {
//   try {
//     const { body } = req
//     // const { email } = body
//     const entity = await User.findOne(body).cache(false, 86400, body.email)
//     res.locals.response = {
//       data: entity,
//       message: 'Found User.',
//       statusCode: '000'
//     }
//     next()
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const readBySlug = () => async (req, res) => {
//   try {
//     const { body } = req
//     // const { slug } = body
//     const entity = await Item.findOne(body).cache(false, 86400, body.slug)
//     sendResponse(res, {
//       data: entity,
//       message: 'Found item.',
//       statusCode: '000'
//     })
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const readAll = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const { queryBody, search, page, limit } = body
//     const skip = limit * (page - 1)
//     body.skip = skip
//     if (search) queryBody.$text = { $search: search }
//     const { entities, pages } = await readAllOnes(model, body)
//     if (end)
//       sendResponse(res, {
//         data: entities,
//         pages,
//         message: `All Found ${model.modelName}.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entities,
//         pages,
//         message: `All Found ${model.modelName}.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const update = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const { _id } = body
//     delete body._id
//     const entity = await updateOne(model, { _id }, body)
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: `${model.modelName} have been updated successfully.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: `${model.modelName} have been updated successfully.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const updateByEmail = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const { email } = body
//     delete body.email
//     const entity = await updateOne(model, { email }, body)
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: `${model.modelName} have been updated successfully.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: `${model.modelName} have been updated successfully.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const remove = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const entity = await removeOne(model, body)
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: `${model.modelName} have been removed successfully.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: `${model.modelName} have been removed successfully.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const removeByUpdate = (model, end = true) => async (req, res, next) => {
//   try {
//     const { body } = req
//     const entity = await deleteOne(model, body, req.user._id)
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: `${model.modelName} have been removed successfully.`,
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: `${model.modelName} have been removed successfully.`,
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const elasticsearch = model => async (req, res) => {
//   try {
//     const { body } = req
//     const { page, size, terms, match, range, search, sort } = body
//     const from = (page - 1) * size
//     const filter = []
//     for (let [key, values] of Object.entries(terms)) {
//       filter.push({
//         terms: {
//           [key]: values.map(value => value.toLowerCase().trim())
//         }
//       })
//     }
//     for (let [key, value] of Object.entries(match)) {
//       filter.push({
//         match: {
//           [key]: value.toLowerCase().trim()
//         }
//       })
//     }
//     for (let [key, value] of Object.entries(range)) {
//       const { gte, lte } = value
//       const ranges = {}
//       if (gte) ranges.gte = gte.toLowerCase().trim()
//       if (lte) ranges.lte = lte.toLowerCase().trim()
//       filter.push({
//         range: {
//           [key]: ranges
//         }
//       })
//     }
//     const must = [{ term: { deleted: 'false' } }]
//     const bool = { must }
//     const query = { bool }
//     if (search)
//       must.push({ multi_match: { query: search.toLowerCase().trim() } })
//     if (filter.length > 0) bool.filter = filter
//     const filterBody = { from, size, query, sort }
//     const hashKey = model.modelName
//     const key = hash.md5(JSON.stringify(filterBody))
//     const cached = await hgetKeyValue(hashKey, key)
//     if (cached) {
//       sendResponse(res, {
//         data: JSON.parse(cached),
//         message: `${hashKey} that matched filter parameters.`,
//         statusCode: '000'
//       })
//     } else {
//       model.esSearch(filterBody, (error, entity) => {
//         if (error) sendError(res, error)
//         else {
//           const result = entity.hits.hits
//           hsetKeyValue(hashKey, key, JSON.stringify(result))
//           expireKey(hashKey, 86400)
//           sendResponse(res, {
//             data: result,
//             message: `${hashKey} that matched filter parameters.`,
//             statusCode: '000'
//           })
//         }
//       })
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const createSubdocuments = (model, end = true) => async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { body } = req
//     const { _id, subdocuments } = body
//     let entity
//     await Promise.all(
//       subdocuments.map(async subdocument => {
//         const { subdocumentName } = subdocument
//         const queryBody = {
//           $push: {
//             [`${subdocumentName}`]: body[`${subdocumentName}`]
//           }
//         }
//         entity = await updateOne(model, { _id }, queryBody)
//       })
//     )
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: 'Subdocuments have been created successfully.',
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: 'Subdocuments have been created successfully.',
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const updateSubdocuments = (model, end = true) => async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { body } = req
//     const { _id, subdocuments } = body
//     let entity
//     await Promise.all(
//       subdocuments.map(async subdocument => {
//         const { subdocumentName, object } = subdocument
//         const subdoc = body[`${subdocumentName}`][0]
//         let query, queryBody
//         if (object) {
//           queryBody = {
//             $set: {
//               [`${subdocumentName}.$`]: subdoc
//             }
//           }
//           query = { _id, [`${subdocumentName}._id`]: subdoc._id }
//         } else {
//           const { oldValue, newValue } = subdoc
//           queryBody = {
//             $set: {
//               [`${subdocumentName}.$`]: newValue
//             }
//           }
//           query = { _id, [`${subdocumentName}`]: oldValue }
//         }
//         entity = await updateOne(model, query, queryBody)
//       })
//     )
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: 'subdocuments have been updated successfully.',
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: 'subdocuments have been updated successfully.',
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const removeSubdocuments = (model, end = true) => async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { body } = req
//     const { _id, subdocuments } = body
//     let entity
//     await Promise.all(
//       subdocuments.map(async subdocument => {
//         const { subdocumentName, object } = subdocument
//         let queryBody
//         if (object)
//           queryBody = {
//             $pull: {
//               [`${subdocumentName}`]: {
//                 _id: { $in: body[`${subdocumentName}`] }
//               }
//             }
//           }
//         else
//           queryBody = {
//             $pull: {
//               [`${subdocumentName}`]: { $in: body[`${subdocumentName}`] }
//             }
//           }
//         entity = await updateOne(model, { _id }, queryBody)
//       })
//     )
//     if (end)
//       sendResponse(res, {
//         data: entity,
//         message: 'subdocuments have been removed successfully.',
//         statusCode: '000'
//       })
//     else {
//       res.locals.response = {
//         data: entity,
//         message: 'subdocuments have been removed successfully.',
//         statusCode: '000'
//       }
//       next()
//     }
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const login = () => async (req, res) => {
//   try {
//     const { body } = req
//     const { email, password } = body
//     const user = await User.findOne({ email }).cache(false, 86400, email)
//     const { _id, userType, roles, emailConfirmed } = user
//     if (!emailConfirmed) throw new Error(errorName.EMAILNOTCONFIRMED)
//     if (!(await compare(password, user.password)))
//       throw new Error(errorName.INVALIDEMAILORPASSWORD)
//     const token = jsonwebtoken({ _id, userType, roles }, { expiresIn: '1d' })
//     sendResponse(res, {
//       data: { user, token },
//       message: 'you are logged in successfully',
//       statusCode: '000'
//     })
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const sendEmployeeInvitationEmail = () => (req, res) => {
//   try {
//     const { body } = req
//     const { email, roles } = body
//     const token = jsonwebtoken({ email, roles }, { expiresIn: '1d' })
//     mailer({
//       to: email,
//       subject: 'Eden Admin System Invitation',
//       text: `
//       Hello,
//       You have been invited to manage the Eden admin system.
//       Please follow the link below to complete your registration:
//       https://manage.edensolutions.tech/register/${token}

//       Thanks,
//       Eden Support
//       © 2018 [Eden Technologies]. All rights reserved.
//       `
//     })
//     let response = {
//       message: 'Email has been sent successfully',
//       statusCode: '000'
//     }
//     sendResponse(res, response)
//   } catch (error) {
//     console.error(error)
//     sendError(res, error)
//   }
// }

// export const sendConfirmationEmail = () => (req, res) => {
//   try {
//     const { body } = req
//     const { email, name } = body
//     // const { name } = personalInfo
//     const { title, firstName, lastName } = name
//     const token = jsonwebtoken({ email }, { expiresIn: '1h' })
//     mailer({
//       to: email,
//       from: 'info@edensolutions.tech', // "Eden <support@edensolutions.tech>"
//       subject: 'Eden Support - Please Confirm Your Email',
//       HTMLPart: `
//       <h2 style="color: #000">Hello ${title} ${firstName} ${lastName},</h2>
//       <h3 style="color: #000; margin-bottom: 8px;">Welcome to Eden Solutions!</h3>
//       <p style="color: #000; margin-bottom: 5px;">Congratulations, You're almost done with your registration process.</p>
//       <p style="color: #000"; margin-bottom: 5px;><b>Please click the link below to confirm your email</b></p>
//       <p display="flex"; margin: 0;><a href="http://staging.edensolutions.tech/confirmEmail/${token}" target="_blank" style="padding: 8px 20px; margin: 10px 0; text-decoration: none; background-color: rgb(30, 69, 133) !important; color: #fff !important; border-radius: 20px;">Confirm Mail</a></p>
//       <p style="margin-bottom: 5px;">If you did not create an account at Eden Solutions, please ignore this email or contact Eden Support if you have any questions.</p>
//       <p style="margin: 5px auto;">Thanks, <strong>Eden Support</strong></p>
//       <p style="font-style: italic">© 2018 [ <a href="http://staging.edensolutions.tech" target="_blank">Eden Technologies</a> ]. All rights reserved.</p>`
//     })
//     let { response } = res.locals
//     if (!response)
//       response = {
//         message: 'Email has been resent successfully',
//         statusCode: '000'
//       }
//     sendResponse(res, response)
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const sendResetPasswordEmail = () => (req, res) => {
//   try {
//     const { email, name } = res.locals.response.data
//     // const { name } = personalInfo
//     const { title, firstName, lastName } = name
//     const token = jsonwebtoken({ email }, { expiresIn: '1h' })
//     mailer({
//       to: email,
//       from: 'info@edensolutions.tech', // "Eden <support@edensolutions.tech>"
//       subject: 'Eden Support - Reset Password',
//       HTMLPart: `
//       <h2 style="color: #000">Hello ${title} ${firstName} ${lastName},</h2>
//       <p style="color: #000; margin-bottom: 5px;">You recently requested to reset your password for your Eden account.</p>
//       <p style="color: #000; margin-bottom: 5px;">Use the link below to reset it.</p>
//       <p display="flex"; margin: 0;><a href="http://staging.edensolutions.tech/resetPassword/${token}" target="_blank" style="padding: 8px 20px; margin: 10px 0; text-decoration: none; background-color: rgb(30, 69, 133) !important; color: #fff !important; border-radius: 20px;">Reset Password</a></p>
//       <p style="margin-bottom: 5px;">If you did not create an account at Eden Solutions, please ignore this email or contact Eden Support if you have any questions.</p>
//       <p style="margin: 5px auto;">Thanks, <strong>Eden Support</strong></p>
//       <p style="font-style: italic">© 2018 [ <a href="http://staging.edensolutions.tech" target="_blank">Eden Technologies</a> ]. All rights reserved.</p>`
//     })
//     sendResponse(res, {
//       message: 'Reset Password Email has been sent successfully',
//       statusCode: '000'
//     })
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const sendResetConfirmationEmail = () => (req, res) => {
//   try {
//     const { email, name } = res.locals.response.data
//     // const { name } = personalInfo
//     const { title, firstName, lastName } = name
//     const token = jsonwebtoken({ email }, { expiresIn: '1h' })
//     mailer({
//       to: email,
//       from: 'info@edensolutions.tech', // "Eden <support@edensolutions.tech>"
//       subject: 'Eden Support - Please Confirm Your Email',
//       HTMLPart: `
//       <h2 style="color: #000">Hello ${title} ${firstName} ${lastName},</h2>
//       <h3 style="color: #000; margin-bottom: 8px;">Welcome to Eden Solutions!</h3>
//       <p style="color: #000; margin-bottom: 5px;">Congratulations, You're almost done with your registration process.</p>
//       <p style="color: #000"; margin-bottom: 5px;><b>Please click the link below to confirm your email</b></p>
//       <p display="flex"; margin: 0;><a href="http://staging.edensolutions.tech/confirmEmail/${token}" target="_blank" style="padding: 8px 20px; margin: 10px 0; text-decoration: none; background-color: rgb(30, 69, 133) !important; color: #fff !important; border-radius: 20px;">Confirm Mail</a></p>
//       <p style="margin-bottom: 5px;">If you did not create an account at Eden Solutions, please ignore this email or contact Eden Support if you have any questions.</p>
//       <p style="margin: 5px auto;">Thanks, <strong>Eden Support</strong></p>
//       <p style="font-style: italic">© 2018 [ <a href="http://staging.edensolutions.tech" target="_blank">Eden Technologies</a> ]. All rights reserved.</p>`
//     })
//     sendResponse(res, {
//       message: 'Reset Password Email has been sent successfully',
//       statusCode: '000'
//     })
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const authEmployee = () => async (req, res, next) => {
//   try {
//     const { token } = req.params
//     const { email, roles } = authJWT(token)
//     delete req.body.email
//     delete req.body.roles
//     req.body.email = email
//     req.body.roles = roles
//     next()
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const authEmail = () => async (req, res, next) => {
//   try {
//     const { token } = req.params
//     const { email } = authJWT(token)
//     req.body.email = email
//     next()
//   } catch (error) {
//     sendError(res, error)
//   }
// }

// export const generateJWT = () => async (req, res) => {
//   try {
//     const { _id, userType, roles } = req.user
//     const token = jsonwebtoken({ _id, userType, roles }, { expiresIn: '1d' })
//     sendResponse(res, {
//       data: { token },
//       message: 'you are logged in successfully',
//       statusCode: '000'
//     })
//   } catch (error) {
//     sendError(res, error)
//   }
// }
