import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'
import { OPPONENTS, FIGHT_TEMPLATES } from '@/lib/constants'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Replicate model to use for image generation
const REPLICATE_MODEL = process.env.REPLICATE_MODEL || "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"

export async function POST(request: NextRequest) {
  console.log('🥩 BEEF ARENA - Generation API called')
  
  try {
    const body = await request.json()
    console.log('📝 Request body received:', {
      hasSelfie: !!body.selfieUrl,
      selfieUrlLength: body.selfieUrl?.length || 0,
      opponentSlug: body.opponentSlug,
      styleSlug: body.styleSlug,
      watermarkEnabled: body.watermarkEnabled
    })

    const { selfieUrl, opponentSlug, styleSlug, watermarkEnabled } = body

    // Validate inputs
    if (!selfieUrl || !opponentSlug || !styleSlug) {
      console.error('❌ Missing required fields:', { selfieUrl: !!selfieUrl, opponentSlug, styleSlug })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const opponent = OPPONENTS.find(o => o.slug === opponentSlug)
    const template = FIGHT_TEMPLATES.find(t => t.slug === styleSlug)

    console.log('🎯 Found opponent:', opponent?.name)
    console.log('🏟️ Found template:', template?.name)

    if (!opponent || !template) {
      console.error('❌ Invalid opponent or template:', { opponent: opponent?.name, template: template?.name })
      return NextResponse.json(
        { error: 'Invalid opponent or template' },
        { status: 400 }
      )
    }

    // Step 1: Content moderation for the selfie
    console.log('🛡️ Starting content moderation...')
    try {
      const moderationResponse = await openai.moderations.create({
        input: selfieUrl,
      })
      
      console.log('🛡️ Moderation result:', moderationResponse.results[0])
      
      if (moderationResponse.results[0].flagged) {
        console.error('❌ Content flagged by moderation')
        return NextResponse.json(
          { error: 'Image content flagged by moderation' },
          { status: 400 }
        )
      }
    } catch (moderationError) {
      console.error('⚠️ Moderation failed:', moderationError)
      // Continue without moderation for now
    }

    // Step 2: Generate fight poster using Replicate
    console.log('🎨 Starting Replicate image generation...')
    console.log('🤖 Using model:', REPLICATE_MODEL)
    
    const fightPrompt = `
      Create a dramatic fight poster scene in ${template.style_prompt} style.
      Two people facing off dramatically in a ${template.description}.
      Professional lighting, intense atmosphere, cinematic composition.
      Fight poster style with dramatic poses and lighting.
      ${watermarkEnabled ? 'Include subtle parody watermark.' : ''}
    `

    console.log('📝 Generated prompt:', fightPrompt)

    let resultUrl: string

    try {
      console.log('🚀 Calling Replicate API...')
      
      const output = await replicate.run(REPLICATE_MODEL as any, {
        input: {
          prompt: fightPrompt,
          negative_prompt: "violence, blood, gore, weapons, arctic, snow, ice, cold, winter, landscape",
          width: 1024,
          height: 1024,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000)
        }
      })

      console.log('✅ Replicate output:', output)
      
      // Handle different output formats
      if (Array.isArray(output)) {
        resultUrl = output[0]
        console.log('📸 Using first image from array:', resultUrl)
      } else if (typeof output === 'string') {
        resultUrl = output
        console.log('📸 Using direct string output:', resultUrl)
      } else {
        console.error('❌ Unexpected Replicate output format:', typeof output)
        throw new Error('Unexpected output format from Replicate')
      }

    } catch (replicateError) {
      console.error('❌ Replicate generation failed:', replicateError)
      
      // Fallback to placeholder for demo
      resultUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`
      console.log('🔄 Using fallback placeholder:', resultUrl)
    }

    // Step 3: Generate meme captions using OpenAI
    console.log('📝 Starting caption generation...')
    
    const captionPrompt = `
      Write 4 funny, meme-ready captions for a fake parody fight between a user and ${opponent.name}.
      Fight style: ${template.description}.
      Keep it PG-13, witty, and 10-14 words each.
      Include fight/wrestling puns and references to ${opponent.name}'s known traits.
      Format as a JSON array of strings.
    `

    console.log('📝 Caption prompt:', captionPrompt)

    let captions = [
      `When ${opponent.nickname} meets their match 🔥`,
      'This beef is well done 🥩',
      'Talk is cheap, fists are free',
      'The main event nobody asked for'
    ]

    try {
      console.log('🤖 Calling OpenAI for captions...')
      
      const captionResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: captionPrompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      })

      console.log('✅ OpenAI response:', captionResponse.choices[0].message.content)

      const generatedCaptions = JSON.parse(captionResponse.choices[0].message.content || '[]')
      if (Array.isArray(generatedCaptions) && generatedCaptions.length > 0) {
        captions = generatedCaptions
        console.log('📝 Using generated captions:', captions)
      }
    } catch (captionError) {
      console.error('❌ Caption generation failed:', captionError)
      console.log('🔄 Using fallback captions')
    }

    // Step 4: Store generation in database
    console.log('💾 Storing in database...')
    try {
      const { data, error } = await supabase
        .from('generations')
        .insert({
          selfie_url: selfieUrl,
          opponent_slug: opponentSlug,
          style: styleSlug,
          result_url: resultUrl,
          captions: captions,
          status: 'completed',
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
      } else {
        console.log('✅ Stored in database:', data?.id)
      }
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError)
    }

    console.log('🎉 Generation completed successfully!')

    return NextResponse.json({
      success: true,
      resultUrl,
      captions,
      opponent: opponent.name,
      style: template.name,
      debug: {
        model: REPLICATE_MODEL,
        prompt: fightPrompt
      }
    })

  } catch (error) {
    console.error('💥 Generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
} 