// import { NextResponse } from 'next/server';

// import { connectTODB } from '../../../lib/conn';
// import { CommonResponse } from '../../../lib/server/func';
// import ChatList from '../../models/ChatList.model';
// export async function GET(request) {
//   try {
//     await connectTODB();

//     // Get the URL and parse query parameters
//     const { searchParams } = new URL(request.url);
//     let pageNum = parseInt(searchParams.get('page')) || 1;
//     let limitNum = parseInt(searchParams.get('limit')) || 10;
//     let lang = searchParams.get('lang') || "";

//     const skip = (pageNum - 1) * limitNum;

//     // console.log(lang,'lang')
//     // Fetch feedbacks with pagination
//     const data = await ChatList.find({lang:lang.trim()}).skip(skip).limit(limitNum).sort('-createdAt').lean();
//     const totalCount = await ChatList.countDocuments({lang:lang.trim()});

//     const paginate = {
//       totalCount: totalCount,
//       totalPage: Math.ceil(totalCount / limitNum),
//       currentPage: pageNum,
//       currentLimit: limitNum,
//       hasNextPage: data.length === limitNum
//     };

//     // Include pagination data in the response
//     return NextResponse.json(
//       CommonResponse.success(200, 'Chat fetch!', data,paginate)
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       CommonResponse.error(400, 'Failed to fetch Chat', null)
//     );
//   }
// }
// export async function POST(request) {
//   try {
//     await connectTODB();
//     const bodyData = await request.json();

//     if (!bodyData?.lang) {
//       bodyData.lang = 'en';
//     }

//     let data = await ChatList.create(bodyData);
//     if (!data) {
//       return NextResponse.json(
//         CommonResponse.error(400, 'Failed to create chat', null)
//       );
//     }
//     data = data.toObject();

//     return NextResponse.json(
//       CommonResponse.success(201, 'Chat Created!', data)
//     );
//   } catch (error) {
//     return NextResponse.json(
//       CommonResponse.error(400, 'Failed to create chat', null)
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { connectTODB } from '../../../lib/conn';
import { CommonResponse } from '../../../lib/server/func';
import ChatList from '../../models/ChatList.model';

export async function GET(request) {
  try {
    await connectTODB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const pageNum = parseInt(searchParams.get('page')) || 1;
    const limitNum = parseInt(searchParams.get('limit')) || 10;
    const lang = searchParams.get('lang') || '';

    const skip = (pageNum - 1) * limitNum;

    // Fetch chats with pagination
    const data = await ChatList.find({ lang: lang.trim() })
      .skip(skip)
      .limit(limitNum)
      .sort('-createdAt')
      .lean();
    const totalCount = await ChatList.countDocuments({ lang: lang.trim() });

    const paginate = {
      totalCount: totalCount,
      totalPage: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      currentLimit: limitNum,
      hasNextPage: data.length === limitNum,
    };

    // Include pagination data in the response
    return NextResponse.json(
      CommonResponse.success(200, 'Chat fetched successfully!', data, paginate)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      CommonResponse.error(400, 'Failed to fetch chats', null)
    );
  }
}

export async function POST(request) {
  try {
    await connectTODB();
    const bodyData = await request.json();

    // Set default or generated responseText if not provided
    if (!bodyData.responseText) {
      bodyData.responseText = `Auto-response: Received your input - "${bodyData.inputText}"`;
    }

    // Set default language if not provided
    if (!bodyData.lang) {
      bodyData.lang = 'en';
    }

    // Create new chat entry
    let data = await ChatList.create(bodyData);
    if (!data) {
      return NextResponse.json(
        CommonResponse.error(400, 'Failed to create chat', null)
      );
    }
    data = data.toObject();

    return NextResponse.json(
      CommonResponse.success(201, 'Chat created successfully!', data)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      CommonResponse.error(400, 'Failed to create chat', null)
    );
  }
}
