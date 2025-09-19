import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'
import { OPPONENTS, FIGHT_TEMPLATES } from '@/lib/constants'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const REPLICATE_MODEL = process.env.REPLICATE_MODEL || "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"

export async function POST(request: NextRequest) {
  console.log('🥩 BEEF ARENA - Celebrity vs Celebrity Generation API called')
  let resultUrl: string = `https://picsum.photos/1024/1024?random=${Date.now()}`

  try {
    const body = await request.json()
    console.log('📝 Request body received:', {
      fighter1Slug: body.fighter1Slug,
      fighter2Slug: body.fighter2Slug,
      styleSlug: body.styleSlug,
      watermarkEnabled: body.watermarkEnabled
    })
    
    const { fighter1Slug, fighter2Slug, styleSlug, watermarkEnabled } = body

    // Validate required fields
    if (!fighter1Slug || !fighter2Slug || !styleSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: fighter1Slug, fighter2Slug, styleSlug' },
        { status: 400 }
      )
    }

    // Validate fighters are different
    if (fighter1Slug === fighter2Slug) {
      return NextResponse.json(
        { error: 'Fighters must be different' },
        { status: 400 }
      )
    }

    // Find fighters
    const fighter1 = OPPONENTS.find(o => o.slug === fighter1Slug)
    const fighter2 = OPPONENTS.find(o => o.slug === fighter2Slug)
    const template = FIGHT_TEMPLATES.find(t => t.slug === styleSlug)

    if (!fighter1) {
      return NextResponse.json({ error: `Fighter 1 not found: ${fighter1Slug}` }, { status: 404 })
    }
    if (!fighter2) {
      return NextResponse.json({ error: `Fighter 2 not found: ${fighter2Slug}` }, { status: 404 })
    }
    if (!template) {
      return NextResponse.json({ error: `Template not found: ${styleSlug}` }, { status: 404 })
    }

    console.log('🎯 Found fighters:', {
      fighter1: fighter1.name,
      fighter2: fighter2.name,
      template: template.name
    })

    // Generate fight prompt with enhanced celebrity descriptions
    const fightPrompt = `
      Create a dramatic fight poster scene in ${template.style_prompt} style.
      Two people facing off dramatically in a ${template.description}.
      
      Fighter 1: ${fighter1.description}
      Fighter 2: ${fighter2.description}
      
      Professional lighting, intense atmosphere, cinematic composition.
      Fight poster style with dramatic poses and lighting.
      Include both fighters prominently in the frame.
      ${watermarkEnabled ? 'Include subtle "BEEF ARENA" watermark.' : ''}
    `

    // Step 3: Generate image using AI
    try {
      console.log('🎨 Starting Replicate image generation...')
      console.log('🤖 Using model:', REPLICATE_MODEL)
      console.log('📝 Generated prompt:', fightPrompt)

      console.log(`🚀 Calling Replicate API...`)
      
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
      console.log('🔍 Output type:', typeof output)
      console.log('🔍 Is array:', Array.isArray(output))
      if (Array.isArray(output)) {
        console.log('🔍 First item type:', typeof output[0])
        console.log('🔍 First item:', output[0])

        const firstOutput = output[0]
        if (typeof firstOutput === 'string') {
          resultUrl = firstOutput
          console.log('📸 Using first image URL from array:', resultUrl)
        } else if (firstOutput && typeof firstOutput === 'object' && 'url' in firstOutput) {
          console.log('🔍 URL property type:', typeof firstOutput.url)
          if (typeof firstOutput.url === 'function') {
            try {
              const urlResult = await (firstOutput as any).url()
              resultUrl = typeof urlResult === 'object' && urlResult.href ? urlResult.href : String(urlResult)
              console.log('📸 Got URL from function call:', resultUrl)
            } catch (error) {
              console.error('❌ Error calling URL function:', error)
              console.log('🔄 Using default placeholder due to URL function error')
            }
          } else if (typeof firstOutput.url === 'string') {
            resultUrl = firstOutput.url
            console.log('📸 Got URL from string property:', resultUrl)
          } else {
            console.error('❌ URL property is neither function nor string:', typeof firstOutput.url)
            console.log('🔄 Using default placeholder due to unknown URL type')
          }
        } else {
          console.error('❌ First array item is not a string or URL object:', typeof firstOutput)
          console.error('❌ First item details:', firstOutput)
          console.log('🔄 Using default placeholder due to Replicate format issue')
        }
      } else if (typeof output === 'string') {
        resultUrl = output
        console.log('📸 Using direct string output:', resultUrl)
      } else if (output && typeof output === 'object' && 'url' in output) {
        resultUrl = (output as any).url
        console.log('📸 Using URL property from object:', resultUrl)
      } else {
        console.error('❌ Unexpected Replicate output format:', typeof output, output)
        console.log('🔄 Using default placeholder due to unknown format')
      }

    } catch (replicateError) {
      console.error('❌ Replicate generation failed:', replicateError)
      console.log('🔄 Using fallback placeholder:', resultUrl)
    }

    // Step 4: Generate captions using OpenAI
    let captions: string[] = []
    
    try {
      console.log('📝 Starting caption generation...')
      const captionPrompt = `
        Write 4 funny, meme-ready captions for a fake parody fight between ${fighter1.name} and ${fighter2.name}.
        Fight style: ${template.description}.
        Keep it PG-13, witty, and 10-14 words each.
        Include fight/wrestling puns and references to both celebrities' known traits.
        Format as a JSON array of strings.
      `
      console.log('📝 Caption prompt:', captionPrompt)
      
      console.log('🤖 Calling OpenAI for captions...')
      
      const captionResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: captionPrompt }
        ],
        temperature: 0.9,
        max_tokens: 200
      })

      const captionText = captionResponse.choices[0]?.message?.content || '[]'
      console.log('✅ OpenAI response:', captionText)
      
      try {
        captions = JSON.parse(captionText)
        console.log('📝 Using generated captions:', captions)
      } catch (parseError) {
        console.error('❌ Failed to parse captions JSON:', parseError)
        captions = [
          `${fighter1.name} vs ${fighter2.name}: The ultimate showdown!`,
          `When ${fighter1.nickname} meets ${fighter2.nickname} in the ring!`,
          `This fight is more heated than their Twitter beef!`,
          `The battle everyone didn't know they needed!`
        ]
        console.log('🔄 Using fallback captions')
      }
    } catch (captionError) {
      console.error('❌ Caption generation failed:', captionError)
      captions = [
        `${fighter1.name} vs ${fighter2.name}: The ultimate showdown!`,
        `When ${fighter1.nickname} meets ${fighter2.nickname} in the ring!`,
        `This fight is more heated than their Twitter beef!`,
        `The battle everyone didn't know they needed!`
      ]
      console.log('🔄 Using fallback captions')
    }

    // Step 5: Store generation in database (optional - don't fail if this fails)
    console.log('💾 Storing in database...')
    try {
      const { data, error } = await supabase
        .from('beefarena_generations')
        .insert({
          fighter1_slug: fighter1Slug,
          fighter2_slug: fighter2Slug,
          style: styleSlug,
          result_url: resultUrl,
          captions: captions,
          status: 'completed',
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Database error (continuing anyway):', error)
      } else {
        console.log('✅ Stored in database:', data?.id)
      }
    } catch (dbError) {
      console.error('❌ Database operation failed (continuing anyway):', dbError)
      // Continue execution even if database fails
    }

    console.log('🎉 Generation completed successfully!')
    return NextResponse.json({
      success: true,
      resultUrl,
      captions,
      fighter1: fighter1.name,
      fighter2: fighter2.name,
      style: template.name,
      debug: { 
        model: REPLICATE_MODEL, 
        prompt: fightPrompt,
        celebrityFight: true
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