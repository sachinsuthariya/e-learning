import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import _ = require("lodash");
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { BookUtils } from "./bookUtils";
import { Utils } from "../../../helpers/utils";
import { Media } from "../../../helpers/media";
import { FileTypes } from "../../../config/enums";

export class BookController {
  private bookUtils: BookUtils = new BookUtils();

  public create = async (req: any, res: Response) => {
    try {
      console.log(req.body);
      req.body.id = Utils.generateUUID();
      const image = req.files.image;
      if (image) {
        req.body.attachment = Media.uploadImage(image, FileTypes.BOOKS)
      }
      console.log(req.body);
      await this.bookUtils.create(req.body);
      const book = await this.bookUtils.getById(req.body.id);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public createEnquiry = async (req: any, res: Response) => {
    try {
      req.body.id = Utils.generateUUID();
      const currentTimestamp = new Date()
                              .toISOString()
                              .slice(0, 19)
                              .replace("T", " ");
      req.body.purchase_date  = currentTimestamp;
      
      const enquiry = await this.bookUtils.createEnquiry(req.body);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enquiry
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public getById = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const book = await this.bookUtils.getById(id);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public allBooks = async (req: any, res: Response) => {
    try {
      const books = await this.bookUtils.getAllBooks();

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        books
      );
      return res.status(response.code).json(response);
    } catch (err) {      
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public delete = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const book = await this.bookUtils.destroy(id);

      if (!book || !book.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.FAIL_CODE,
          req.t("INAVALID_REQUEST")
        );
        return res.status(response.code).json(response);
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_CURRENT_AFFAIR_DELETE")
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public restore = async (req: any, res: Response) => {
    try {
      const id = req.params.id;
      const book = await this.bookUtils.restoreBook(id);

      if (!book || !book.affectedRows) {
        const response = ResponseBuilder.genSuccessResponse(
          Constants.FAIL_CODE,
          req.t("INAVALID_REQUEST")
        );
        return res.status(response.code).json(response);
      }

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS_CURRENT_AFFAIR_RESTORE")
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public update = async (req: any, res: Response) => {
    console.log(req.body);
    try {
      console.log(req.body);
      const bookId = req.params.id;
      const image = req.files.image;
      const bookDetails: any = {
        title: req.body.title,
        description: req.body.description,
        isFree: req.body.isFree,
        price: req.body.price,
        payment_url: req.body.payment_url,
        status: req.body.status,
      };

      if (image) {
        bookDetails.attachment = Media.uploadImage(image, FileTypes.BOOKS)
        await this.bookUtils.deleteImage(bookId)
      }
      console.log(bookDetails);
      const updateBook = await this.bookUtils.updateById(bookId, bookDetails);

      if (!updateBook || !updateBook.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const book = await this.bookUtils.getById(bookId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };

  public updateStatus = async (req: any, res: Response) => {
    try {
      const bookId = req.params.id;
      const bookDetails = {
        status: req.body.status,
      };

      const updateBooks = await this.bookUtils.updateById(bookId, bookDetails);

      if (!updateBooks || !updateBooks.affectedRows) {
        const response = ResponseBuilder.genErrorResponse(
          Constants.NOT_FOUND_CODE,
          req.t("CURRENT_AFFAIR_NOT_FOUND")
        );
        return res.status(response.error.code).json(response);
      }

      const book = await this.bookUtils.getById(bookId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        book
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public enrollBookUser = async (req: any, res: Response) => {
    try {
      // console.log(req);
      // return;
      const bookId = req.params.id;
      const studentId = req.body.student_id;
      // console.log("user Id :", req.user);
      const enroll = await this.bookUtils.studentEnrollment(bookId, studentId);

      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enroll
      );
      // console.log(response);
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  }
  public enrolledStudentsCheckAdmin = async (req: any, res: Response) => {
    // console.log(req.pa)
    try {
      const bookId = req.params.id;
      // return loginUserId;
      const enrolledStudents = await this.bookUtils.bookEnrolledStudents(bookId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledStudents
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public enrolledBooks = async (req: any, res: Response) => {
    try {
      const loginUserId = req.user && req.user.id ? req.user.id : null;

      const enrolledBooks = await this.bookUtils.userEnrolledBooks(loginUserId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledBooks
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
  public enrolledBooksCheckAdmin = async (req: any, res: Response) => {
    try {
      const userId = req.params.id;
      const enrolledBooks = await this.bookUtils.userEnrolledBooks(userId);
      const response = ResponseBuilder.genSuccessResponse(
        Constants.SUCCESS_CODE,
        req.t("SUCCESS"),
        enrolledBooks
      );
      // console.log(response);
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = ResponseBuilder.genErrorResponse(
        Constants.INTERNAL_SERVER_ERROR_CODE,
        req.t("ERR_INTERNAL_SERVER")
      );
      return res.status(response.error.code).json(response);
    }
  };
}
