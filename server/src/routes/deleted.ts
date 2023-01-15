import express from "express";
import { 
    createDeleted, 
    getDeleted,
    getFullDeleted,
    getDeletedByAuditID, 
    getDeletedByQRCodeKey, 
    getDeletedOfType 
} from "../controllers/deleted";

const router = express.Router()

router.get('/', getDeleted);

router.get('/full', getFullDeleted)

router.get('/:type', getDeletedOfType);

router.get('/:audit_id', getDeletedByAuditID);

router.get('/:qr_code_key', getDeletedByQRCodeKey);

router.post('/', createDeleted);

export default router;