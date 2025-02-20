import { displayDateTime } from "@/utils/formater";
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";

const body = {
  "id": "9a2c93fe-280e-4426-a392-2b7724b56e17",
  "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
  "customerId": "225bee9f-3896-414e-a41d-6fcbf808422e",
  "name": "Majalah Manchester City",
  "description": "- Majalah Liga Inggris\n- Majalah Liga Champion",
  "isDone": false,
  "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
  "createDt": "2025-01-04T14:02:12.489+07:00",
  "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
  "updateDt": "2025-01-07T14:02:12.48912+07:00",
  "deleteDt": null,
  "orderphaseId": "54791319-27e1-48b8-9eba-b1b402a478e3",
  "phaseId": "c33a2001-fda8-4417-ace0-56114b06daf0",
  "orderphaseName": "Design",
  "totalDesign": 50000,
  "totalPrint": 280700000,
  "totalFinishing": 12940000,
  "totalOther": 13200000,
  "totalTransaction": 10000000,
  "totalOrder": 306890000,
  "outstanding": 296890000,
  "companyName": "Demo Company",
  "customerName": "Alguero",
  "createName": "Admin Demo",
  "updateName": "Admin Demo",
  "company": {
    "id": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
    "name": "Demo Company",
    "description": "Demo Company Generated",
    "photoId": "",
    "photoUrl": "",
    "createBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
    "createDt": "2025-01-07T13:47:50.603769+07:00",
    "updateBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
    "updateDt": "2025-01-07T13:47:50.603769+07:00",
    "deleteDt": null,
    "createName": "Jihan Lugas",
    "updateName": "Jihan Lugas"
  },
  "customer": {
    "id": "225bee9f-3896-414e-a41d-6fcbf808422e",
    "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
    "name": "Alguero",
    "description": "Generated Data",
    "phoneNumber": "6281231231234",
    "createBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
    "createDt": "2025-01-07T13:47:50.611736+07:00",
    "updateBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
    "updateDt": "2025-01-07T13:47:50.611736+07:00",
    "deleteDt": null,
    "companyName": "Demo Company",
    "createName": "Jihan Lugas",
    "updateName": "Jihan Lugas"
  },
  "designs": [
    {
      "id": "07fcb0a7-7a2b-4bae-9627-6752e7e80e53",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Cover Liga Inggris",
      "description": "Photo photo liga inggris",
      "qty": 1,
      "price": 20000,
      "total": 20000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.490794+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.490794+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "Cover Liga Inggris",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    },
    {
      "id": "ae90b867-e4cc-44c2-b7cd-443998e66d9d",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Cover iga champion",
      "description": "photo liga champion",
      "qty": 1,
      "price": 30000,
      "total": 30000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.490794+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.490794+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "Cover iga champion",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    }
  ],
  "prints": [
    {
      "id": "3d19bd3d-778c-4bbe-9d27-8079a9ab78cd",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "paperId": "0b344d21-0b54-4675-9395-256e0bd160af",
      "name": "Cover Liga Inggris",
      "description": "Cover 400 lembar",
      "isDuplex": false,
      "pageCount": 1,
      "qty": 400,
      "price": 3200,
      "total": 1280000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.491899+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.491899+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo",
      "paper": {
        "id": "0b344d21-0b54-4675-9395-256e0bd160af",
        "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
        "name": "A3 Art Carton 230",
        "description": "",
        "createBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "createDt": "2025-01-07T13:47:50.609406+07:00",
        "updateBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "updateDt": "2025-01-07T13:47:50.609406+07:00",
        "deleteDt": null,
        "companyName": "Demo Company",
        "createName": "Jihan Lugas",
        "updateName": "Jihan Lugas"
      }
    },
    {
      "id": "4d472a82-7104-41ef-b5fc-850b668aea97",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "paperId": "e9bd1904-42c4-4a6b-8f45-e4bc3dd3b8dd",
      "name": "Cover Liga Champion",
      "description": "Cover 300 lembar",
      "isDuplex": false,
      "pageCount": 1,
      "qty": 300,
      "price": 3400,
      "total": 1020000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.491899+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.491899+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo",
      "paper": {
        "id": "e9bd1904-42c4-4a6b-8f45-e4bc3dd3b8dd",
        "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
        "name": "A3 Art Carton 260",
        "description": "",
        "createBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "createDt": "2025-01-07T13:47:50.609406+07:00",
        "updateBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "updateDt": "2025-01-07T13:47:50.609406+07:00",
        "deleteDt": null,
        "companyName": "Demo Company",
        "createName": "Jihan Lugas",
        "updateName": "Jihan Lugas"
      }
    },
    {
      "id": "7ce43784-cb59-4c79-a497-375159c60f71",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "paperId": "03d6f030-d661-43e9-af1b-31eb0b2dfbf8",
      "name": "Isi Liga Inggris",
      "description": "Isi timbal balik 120 lembar",
      "isDuplex": true,
      "pageCount": 120,
      "qty": 400,
      "price": 3000,
      "total": 144000000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.491899+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.491899+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo",
      "paper": {
        "id": "03d6f030-d661-43e9-af1b-31eb0b2dfbf8",
        "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
        "name": "A3 Art Paper 120",
        "description": "",
        "createBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "createDt": "2025-01-07T13:47:50.609405+07:00",
        "updateBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "updateDt": "2025-01-07T13:47:50.609405+07:00",
        "deleteDt": null,
        "companyName": "Demo Company",
        "createName": "Jihan Lugas",
        "updateName": "Jihan Lugas"
      }
    },
    {
      "id": "985dfe1f-9e06-400d-b2f4-11ad4e796d65",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "paperId": "223528c7-5da3-4e27-80cd-4e42dc04709f",
      "name": "Isi Liga Champion",
      "description": "Isi timbal balik 140 lembar",
      "isDuplex": true,
      "pageCount": 140,
      "qty": 300,
      "price": 3200,
      "total": 134400000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.491899+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.491899+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo",
      "paper": {
        "id": "223528c7-5da3-4e27-80cd-4e42dc04709f",
        "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
        "name": "A3 Art Paper 150",
        "description": "",
        "createBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "createDt": "2025-01-07T13:47:50.609405+07:00",
        "updateBy": "5fd48627-d08c-4334-96af-4d6ec430f15e",
        "updateDt": "2025-01-07T13:47:50.609405+07:00",
        "deleteDt": null,
        "companyName": "Demo Company",
        "createName": "Jihan Lugas",
        "updateName": "Jihan Lugas"
      }
    }
  ],
  "finishings": [
    {
      "id": "c64b51e3-b197-4eb7-a755-107bfaf6d27c",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Potong",
      "description": "Borongan potong 200K",
      "qty": 1,
      "price": 200000,
      "total": 200000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.493453+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.493453+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    },
    {
      "id": "524d252a-01b6-45be-b7f4-475ee22e1f5a",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Laminating Cover",
      "description": "Laminating Cover",
      "qty": 700,
      "price": 1200,
      "total": 840000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.493453+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.493453+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    },
    {
      "id": "a940655e-7699-4637-87d7-dd2711ae6119",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Banding",
      "description": "Banding 700 Buku",
      "qty": 700,
      "price": 17000,
      "total": 11900000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.493453+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.493453+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    }
  ],
  "others": [
    {
      "id": "cbc07e85-6bde-406c-98fb-c0d96c2d5265",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Sampul liga inggris",
      "description": "Borongan ke belakang",
      "qty": 400,
      "price": 18000,
      "total": 7200000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.495691+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.495691+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "Majalah Manchester City",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    },
    {
      "id": "34e6e694-9fab-4f4b-b672-34e2316dd4d3",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "Sampul liga champion",
      "description": "Borongan ke belakang",
      "qty": 300,
      "price": 20000,
      "total": 6000000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:02:12.495692+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:02:12.495692+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "Majalah Manchester City",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    }
  ],
  "transactions": [
    {
      "id": "7510200f-6895-4034-a32e-c9c54588d956",
      "companyId": "550468cd-5c79-4cb0-9b92-7cb63b83eaf7",
      "orderId": "9a2c93fe-280e-4426-a392-2b7724b56e17",
      "name": "DP",
      "description": "DP 10 jt",
      "amount": 10000000,
      "createBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "createDt": "2025-01-07T14:05:09.251508+07:00",
      "updateBy": "b72d9250-e291-4a5b-ab1f-f7a247410013",
      "updateDt": "2025-01-07T14:05:09.251508+07:00",
      "deleteDt": null,
      "companyName": "Demo Company",
      "orderName": "",
      "createName": "Admin Demo",
      "updateName": "Admin Demo"
    }
  ]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  // if (req.method !== "POST") {
  //   res.setHeader("Allow", ["POST"]);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  //   return;
  // }

  try {
    // const { body } = req
    // Create a new PDF document

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');

    const doc = new PDFDocument({
      margins: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
      },
    });
    doc.pipe(res);

    doc.fontSize(18).text(body.company.name, {
      align: "center",
    })
    doc.fontSize(12).text(body.company.description, {
      align: "center",
    })

    doc.moveDown(2)

    doc.fontSize(14).text("Surat Perintah Kerja", {
      align: "center",
    })

    doc.moveDown(2)

    // doc.fontSize(12).lineGap(5)

    // Define fixed x positions
    const firstColumnX = doc.x; // Starting x position for the first column

    // Text line 1 (Customer Service)
    doc.text("Customer Service", { continued: true });
    const firstLineWidth = doc.widthOfString("Customer Service"); // Get width of first line
    doc.text(body.createName, firstColumnX + firstLineWidth + 20); // Add space after first part

    // Move to the next line
    doc.moveDown(1);

    // Text line 2 (Tanggal)
    doc.text("Tanggal", { continued: true });
    const secondLineWidth = doc.widthOfString("Tanggal"); // Get width of second line
    doc.text(displayDateTime(new Date()), firstColumnX + secondLineWidth + 20); // Add space after second part

    doc.moveDown(1)


    // Finalize the document
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }

};

export default handler;

